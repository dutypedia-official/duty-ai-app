// screens/ChatScreen.tsx
import { SafeAreaView, Text, useThemeColor, View } from "@/components/Themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  useColorScheme,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import EventSource from "react-native-sse";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { apiClient, BACKUP_SERVER_URL, MAIN_SERVER_URL } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import { v4 as uuid } from "uuid";
import Constants from "expo-constants";
import { financeRelated } from "../ChatPro";
import Markdown from "react-native-markdown-display";
import RenderChatEmpty from "../Empty";
import axios from "axios";
import { debounce, set, throttle } from "lodash";
import TypingAnimation from "../TypingAnimation";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { useIsFocused } from "@react-navigation/native";
import useUi from "@/lib/hooks/useUi";
import * as WebBrowser from "expo-web-browser";

type Message = {
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
  _id: string;
};

const ChatTurbo = ({ fromPath }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isFocused = useIsFocused();

  const [messages, setMessages] = useState<Message[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);

  const { getToken } = useAuth();
  const client = apiClient();
  const { mainServerAvailable } = useUi();
  const [inputText, setInputText] = useState<string>("");
  const [eventSource, setEventSource] = useState<any>(null);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const inputBgColor = useThemeColor({}, "chatInputBg");
  const chatContainerBgColor = useThemeColor({}, "chatContainerBg");
  const bgColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const placeholder = useThemeColor({}, "placeholder");
  const bubbleLeftBgColor = useThemeColor({}, "bubbleLeftBg");
  const [relatedPrompts, setRelatedPrompts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState(false);
  const isRunningInExpoGo = Constants.appOwnership === "expo";
  const { user } = useUser();
  const [name, setName] = useState("");
  const flashListRef = React.useRef<FlashList<Message>>(null);
  const source = axios.CancelToken.source();
  let es: any = null;
  const updateMessage = (id: string, text: string) => {
    setMessages((previousMessages: any) => {
      const last = [...previousMessages];
      const newLIst = last.map((m, i) => {
        if (m._id == id) m.text = text;
        return m;
      });
      return newLIst;
    });
  };
  const {
    activeConversationId,
    setActiveConversationId,
    template,
    prompt,
    setPrompt,
    setTemplate,
  } = useChat();

  const prepareHistory = (msgs: any) => {
    const h: any = [];
    msgs.forEach((message: any) => {
      if (message.user?.name == "ai") {
        h.push({
          ai: message.text,
        });
      } else if (message.user?.name == "human") {
        h.push({
          human: message.text,
        });
      }
    });
    return h;
  };

  const scrollToBottom = () => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 1000000, animated: true });
    }
  };

  const throttledUpdateMessage = throttle((id, text) => {
    updateMessage(id, text);
  }, 200);

  const sendMessage = async (txt: string) => {
    if (!txt.trim()) {
      return;
    }
    setInputText("");
    const token = await getToken();
    const id = uuid();
    const newMessage = {
      _id: uuid(),
      createdAt: new Date(),
      text: txt,
      user: {
        _id: 1,
        name: "human",
      },
    };
    setRelatedPrompts([]);
    setMessages((prevMessages) => {
      const newMessages = [
        {
          _id: id,
          text: "...",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "ai",
          },
        },
        newMessage,
        ...prevMessages,
      ];
      setTimeout(scrollToBottom, 100);
      return newMessages;
    });
    setIsLoading(true);
    let query = txt.replace(/"/g, "");
    let tConId = null;

    if (!activeConversationId) {
      const { data } = await client.post(
        "/messages/conv/new",
        {
          name: query,
        },
        token,
        mainServerAvailable
      );

      await client.post(
        "/messages/new",
        {
          text: query,
          id: newMessage._id,
          name: "human",
          conversationId: data?.id,
        },
        token,
        mainServerAvailable
      );
      tConId = data.id;
      setActiveConversationId(data?.id);
    } else {
      await client.post(
        "/messages/new",
        {
          text: query,
          id: newMessage._id,
          name: "human",
          conversationId: activeConversationId,
        },
        token,
        mainServerAvailable
      );
    }

    //----------------
    try {
      const history = prepareHistory(messages);

      let localResponse = "";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authrization: `Bearer `,
        },
        cancelToken: source.token,
        body: JSON.stringify({
          query: query,
          history: history,
          messageId: id,
          conversationId: activeConversationId || tConId,
          name: name,
        }),
      };

      const baseUrl = mainServerAvailable ? MAIN_SERVER_URL : BACKUP_SERVER_URL;

      const url =
        template == "finance"
          ? `${baseUrl}/chat/finance`
          : template == "forex"
          ? `${baseUrl}/chat/forex`
          : `${baseUrl}/chat/pro`;

      const urlLocal =
        template == "finance"
          ? `http://192.168.0.107:8000/chat/finance`
          : template == "forex"
          ? `http://192.168.0.107:8000/chat/forex`
          : `http://192.168.0.107:8000/chat/pro`;
      es = new EventSource(isRunningInExpoGo ? urlLocal : url, {
        ...options,
        pollingInterval: 0,
      });
      setEventSource(es);
      if (!isStopped) {
        const listener = (event: any) => {
          if (event.type === "open") {
            setStreaming(true);
            console.log("Open SSE connection.");
            setIsLoading(false);
          } else if (event.type === "message") {
            if (event.data !== "[DONE]") {
              const data = event.data;
              localResponse += JSON.parse(data).content;
              throttledUpdateMessage(id, localResponse);
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else {
              setIsLoading(false);
              console.log("Done!");
              if (template == "finance") {
                if (
                  localResponse?.toLowerCase()?.includes("financial summary") ||
                  localResponse
                    ?.toLowerCase()
                    ?.includes("current stock price") ||
                  localResponse?.toLowerCase()?.includes("balance") ||
                  localResponse?.toLowerCase()?.includes("income") ||
                  localResponse?.toLowerCase()?.includes("dividend") ||
                  localResponse?.toLowerCase()?.includes("cash flow") ||
                  localResponse?.toLowerCase()?.includes("earning")
                ) {
                  setRelatedPrompts(financeRelated);
                } else {
                  Promise.all([
                    client.post(
                      "/tools/get-related-prompt",
                      {
                        query: query,
                        history: `${history.join("\n\n")}`,
                      },
                      null,
                      {},
                      mainServerAvailable
                    ),
                  ])
                    .then(function (responses) {
                      const { data } = responses[0];

                      setRelatedPrompts(data);
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                }
              } else {
                Promise.all([
                  client.post(
                    "/tools/get-related-prompt",
                    {
                      query: query,
                      history: `${history.join("\n\n")}`,
                    },
                    null,
                    {},
                    mainServerAvailable
                  ),
                ])
                  .then(function (responses) {
                    const { data } = responses[0];
                    console.log(data);
                    setRelatedPrompts(data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
              es?.close();
              setStreaming(false);
            }
          } else if (event.type === "error") {
            console.error("Connection error:", event.message);
            setIsLoading(false);
            setStreaming(false);
          } else if (event.type === "exception") {
            console.error("Error:", event.message, event.error);
            setIsLoading(false);
            setStreaming(false);
          }
        };

        es.addEventListener("open", listener);
        es.addEventListener("message", listener);
        es.addEventListener("error", listener);
      }
    } catch (error) {
      es?.close();
      setStreaming(false);
      setIsLoading(false);
      updateMessage(id, "Can't get response! Please try again later.");
      console.log(error);
    } finally {
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const converted: any = item.text.split(regex).map((part, index) => {
      if (
        regex.test(item.text) &&
        index % 3 === 2 &&
        part.includes("https://www.tradingview.com/chart")
      ) {
        const text = item.text.split(regex)[index - 1]; // Get the previous text part for the link label
        return {
          text: text,
          link: part,
        };
      }
      return null;
    });
    console.log(converted, "converted");

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: item?.user?._id == 1 ? "flex-end" : "flex-start",
        }}
      >
        <Pressable
          onLongPress={async () => {
            await Clipboard.setStringAsync(item.text);
            Toast.show({
              type: "success",
              text1: "Copied to clipboard",
              visibilityTime: 2000,
              position: "top",
            });
          }}
          style={{
            backgroundColor:
              item?.user?._id == 1 ? "#0084ff" : bubbleLeftBgColor,
            padding: 10,
            borderRadius: 12,
            marginVertical: 5,
            alignSelf: "flex-start",
          }}
        >
          {item?.user?._id == 1 ? (
            <Text style={{ color: "white" }}>{item.text}</Text>
          ) : item.text === "..." ? (
            <TypingAnimation />
          ) : (
            <Markdown
              style={{
                body: {
                  color:
                    item?.user?._id == 1
                      ? isDark
                        ? "#000"
                        : "#fff"
                      : textColor,
                  fontSize: 16,
                },
                // Headings
                heading1: {
                  fontSize: 24,
                  fontWeight: "bold",
                  marginVertical: 10,
                },
                heading2: {
                  fontSize: 22,
                  fontWeight: "bold",
                  marginVertical: 8,
                },
                heading3: {
                  fontSize: 20,
                  fontWeight: "bold",
                  marginVertical: 6,
                },
                heading4: {
                  fontSize: 18,
                  fontWeight: "bold",
                  marginVertical: 5,
                },
                heading5: {
                  fontSize: 16,
                  fontWeight: "bold",
                  marginVertical: 4,
                },
                heading6: {
                  fontSize: 14,
                  fontWeight: "bold",
                  marginVertical: 3,
                },
                // Lists
                bullet_list: { marginVertical: 5 },
                ordered_list: { marginVertical: 5 },
                list_item: { marginVertical: 3, flexDirection: "row" },
                bullet_list_icon: {
                  marginRight: 5,
                  color: item?.user?._id == 1 ? "white" : textColor,
                },
                ordered_list_icon: {
                  marginRight: 5,
                  color: item?.user?._id == 1 ? "white" : textColor,
                },
                // Code
                code_inline: {
                  fontFamily: "monospace",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  borderRadius: 3,
                  paddingHorizontal: 4,
                },
                fence: {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 5,
                  padding: 10,
                  marginVertical: 5,
                },
                // Table
                table: {
                  borderWidth: 1,
                  borderColor: borderColor,
                  marginVertical: 10,
                },
                tr: {
                  borderBottomWidth: 1,
                  borderColor: borderColor,
                },
                th: {
                  fontWeight: "bold",
                  padding: 5,
                  borderRightWidth: 1,
                  borderColor: borderColor,
                },
                td: {
                  padding: 5,
                  borderRightWidth: 1,
                  borderColor: borderColor,
                },
                // Blockquote
                blockquote: {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  borderLeftWidth: 4,
                  borderLeftColor: item?.user?._id == 1 ? "white" : textColor,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginVertical: 5,
                },
                // Horizontal rule
                hr: {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  height: 1,
                  marginVertical: 10,
                },
              }}
            >
              {item.text}
            </Markdown>
          )}

          {converted &&
            converted.map(
              (c: any) =>
                c?.link && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      paddingBottom: 6,
                    }}
                  >
                    <Text>View Chart</Text>
                    <TouchableOpacity
                      onPress={() => {
                        WebBrowser.openBrowserAsync(c?.link, {
                          showTitle: false,
                          enableBarCollapsing: false,
                        });
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 6,
                        borderRadius: 4,
                        gap: 4,
                        backgroundColor: isDark ? "#333333" : "#EAEDED",
                        borderColor: isDark ? "#333333" : "#EAEDED",
                      }}
                    >
                      <Text>
                        <MaterialIcons
                          name="show-chart"
                          size={14}
                          color={isDark ? "#ffffff" : "#5188D4"}
                        />
                      </Text>
                      <Text
                        style={{
                          color: isDark ? "#FFFFFF" : "#000000",
                          fontSize: 12,
                        }}
                      >
                        Chart
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
            )}

          <View
            style={{
              backgroundColor: "transparent",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <Text style={{ opacity: 0.5, fontSize: 10 }}>
              {new Date(item.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true, // Ensures 12-hour format with AM/PM
              })}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  const fetchMessages = async (id: string) => {
    if (!id) return;
    try {
      const token = await getToken();
      const { data } = await client.get(
        `/messages/get-all/${id}`,
        token,
        {},
        mainServerAvailable
      );
      setRelatedPrompts([]);
      setMessages(data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const stopEventSource = () => {
    setIsStopped(true);
    source.cancel("Request canceled by user");
    setStreaming(false);
    setIsLoading(false);

    if (es) {
      es.close();
      setEventSource(null);
    }

    const lastMessage = messages[0];
    if (lastMessage && lastMessage.text === "...") {
      updateMessage(lastMessage._id, "Cancelled...");
    }
  };

  const stopButton = () => {
    return (
      <TouchableOpacity
        style={{
          width: 32,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={stopEventSource}
      >
        <Ionicons name="stop-circle-outline" size={32} color="red" />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const sortMessages = (msgs: Message[]) => {
      return msgs.sort((a, b) => {
        const dateA =
          a?.createdAt instanceof Date
            ? a.createdAt
            : new Date(a?.createdAt || 0);
        const dateB =
          b?.createdAt instanceof Date
            ? b.createdAt
            : new Date(b?.createdAt || 0);
        return dateA.getTime() - dateB.getTime();
      });
    };

    if (isLoading || streaming) {
      setDisplayMessages(sortMessages(messages.slice(-2)));
    } else {
      setDisplayMessages(sortMessages(messages));
    }
  }, [messages, isLoading, streaming]);

  useEffect(() => {
    if (activeConversationId) {
      if (!isLoading && !streaming) {
        fetchMessages(activeConversationId).then(() => {
          setTimeout(scrollToBottom, 100);
        });
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    setRelatedPrompts([]);

    return () => {
      setActiveConversationId(null);
      setTemplate("finance");
      setRelatedPrompts([]);
    };
  }, []);

  useEffect(() => {
    if (prompt && !activeConversationId) {
      sendMessage(prompt);
      setPrompt("");
    }
  }, [prompt]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(`${user.firstName} ${user.lastName}`);
  }, [user]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: fromPath ? -54 : 0,
        backgroundColor: bgColor,
      }}
    >
      <KeyboardAvoidingView enabled behavior={"padding"} style={{ flex: 1 }}>
        <FlashList
          ListEmptyComponent={() => (
            <RenderChatEmpty
              onPressRelated={(prompt: string) => {
                sendMessage(prompt);
              }}
            />
          )}
          ref={flashListRef}
          data={displayMessages}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          estimatedItemSize={200}
          onContentSizeChange={() => setTimeout(scrollToBottom, 100)}
          onLayout={() => setTimeout(scrollToBottom, 100)}
          ListFooterComponent={() => {
            return (
              <View>
                {relatedPrompts?.length > 0 && messages?.length > 0 && (
                  <View
                    style={{
                      gap: 8,
                      flex: 1,
                      marginRight: 12,
                      marginVertical: 8,
                    }}
                  >
                    {relatedPrompts.map((p: any, i: number) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => sendMessage(p.prompt || p.question)}
                      >
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: borderColor,
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 8,
                            alignSelf: "flex-start",
                          }}
                        >
                          <Text style={{ opacity: 0.5 }} numberOfLines={2}>
                            {p.prompt || p.question}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              backgroundColor: inputBgColor,
              borderBottomColor: borderColor,
              borderTopColor: borderColor,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              marginBottom: 0,
            }}
          >
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() => {
                setActiveConversationId(null);
                setRelatedPrompts([]);
              }}
            >
              <MaterialIcons
                // style={{ opacity: inputText ? 1 : 0.3 }}
                name="post-add"
                size={28}
                color={primaryColor}
              />
            </TouchableOpacity>
            <TextInput
              multiline
              placeholderTextColor={placeholder}
              style={{
                flex: 1,
                borderWidth: 0,
                paddingHorizontal: 10,
                marginRight: 10,
                color: textColor,
                fontSize: 16,
                maxHeight: 100,
              }}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                template == "general"
                  ? "Ask anything"
                  : template == "finance"
                  ? "Enter full company name"
                  : "Enter currency pair name"
              }
              editable={!streaming && !isLoading}
              returnKeyType="send"
            />
            {/* {streaming && stopButton()} */}
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() => sendMessage(inputText)}
            >
              <Ionicons
                style={{ opacity: inputText ? 1 : 0.3 }}
                name="send"
                size={28}
                color={primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  messageText: {
    color: "#fff",
  },

  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  sendButtonText: {
    color: "#fff",
  },
});

export default ChatTurbo;
