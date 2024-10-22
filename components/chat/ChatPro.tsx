import {
  KeyboardAvoidingView,
  Platform,
  Share,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, View, useThemeColor } from "../../components/Themed";
import { GiftedChat } from "react-native-gifted-chat";
import {
  RenderBubble,
  RenderMessageText,
  renderActions,
  renderComposer,
  renderInputToolbar,
  renderMessage,
  renderSend,
} from "@/components/chat/InputToolbar";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { apiClient } from "@/lib/api";
import { v4 as uuid } from "uuid";
import EventSource from "react-native-sse";
import {
  containsNonEnglish,
  duckSearch,
  fetchWithTimeout,
  getClassify,
} from "@/lib/utils";
import he from "he";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import useChat from "@/lib/hooks/useChat";
import { throttle } from "lodash";
import RenderChatEmpty from "./Empty";
import { Button } from "react-native-paper";
import useLang from "@/lib/hooks/useLang";
import Constants from "expo-constants";

const source = axios.CancelToken.source();

export const financeRelated = [
  {
    label: "বাংলায় এই স্টকের বিষয়ে বল",
    prompt: "বাংলায় এই স্টকের বিষয়ে বল",
  },
  {
    label: "এই স্টকের গতকালকের পারফরম্যান্স কেমন ছিল?",
    prompt: "এই স্টকের গতকালকের পারফরম্যান্স কেমন ছিল?",
  },
  {
    prompt: "আজকের জন্য এই স্টকের পূর্বাভাস কী?",
    label: "আজকের জন্য এই স্টকের পূর্বাভাস কী?",
  },
  {
    prompt: "এই স্টকের জন্য ভবিষ্যৎ প্রবণতা কী হতে পারে?",
    label: "এই স্টকের জন্য ভবিষ্যৎ প্রবণতা কী হতে পারে?",
  },
  {
    label: "এই স্টকের জন্য আগামী মাসের পূর্বাভাস কী?",
    prompt: "এই স্টকের জন্য আগামী মাসের পূর্বাভাস কী?",
  },
  {
    label: "আগামী মাসে এই স্টকের জন্য সম্ভাব্য ঝুঁকি কী কী?",
    prompt: "আগামী মাসে এই স্টকের জন্য সম্ভাব্য ঝুঁকি কী কী?",
  },
];

export default function ChatPro({ fromPath }: any) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFailed, setIsFailed] = useState<any>(false);
  const { language, setLanguage } = useLang();
  const isBn = language === "Bn";
  const {
    activeConversationId,
    setActiveConversationId,
    template,
    prompt,
    setPrompt,
    setTemplate,
  } = useChat();
  const [eventSource, setEventSource] = useState<any>(null);
  const [name, setName] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([]);
  const [relatedPrompts, setRelatedPrompts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNewMessages, setIsFetchingNewMessages] = useState(false);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const inputBgColor = useThemeColor({}, "chatInputBg");
  const chatContainerBgColor = useThemeColor({}, "chatContainerBg");
  const bgColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const bubbleLeftBgColor = useThemeColor({}, "bubbleLeftBg");
  const tabBarHeight = useBottomTabBarHeight();
  const isRunningInExpoGo = Constants.appOwnership === "expo";
  const modifiedMessages = messages.map((message: any) => ({
    ...message,
    _id: message.id || message._id,
  }));

  const client = apiClient();
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

  const throttledUpdateMessage = throttle((id, text) => {
    updateMessage(id, text);
  }, 200);

  const fetchMessages = async (id: string) => {
    if (!id) return;
    try {
      setIsFetchingNewMessages(true);
      const token = await getToken();
      const { data } = await client.get(`/messages/get-all/${id}`, token);
      setRelatedPrompts([]);
      setMessages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingNewMessages(false);
    }
  };

  const prepareHistory = (msgs: any) => {
    const h: any = [];
    msgs.forEach((message: any) => {
      if (!containsNonEnglish(message.text)) {
        if (message.user?.name == "ai") {
          h.push({
            ai: message.text,
          });
        } else if (message.user?.name == "human") {
          h.push({
            human: message.text,
          });
        }
      }
    });
    return h.reverse();
  };

  const onSend = useCallback(
    async (newMessages: any = []) => {
      setIsFailed(false);
      const token = await getToken();
      setIsStopped(false);
      setMessages((previousMessages: never[] | undefined) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      setTimeLeft(30);
      setIsLoading(true);
      const id = uuid();
      const hId = uuid();
      setMessages((previousMessages: never[] | undefined) =>
        GiftedChat.append(previousMessages, [
          {
            _id: id,
            text: "...",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "ai",
            },
          },
        ])
      );
      let query = newMessages[0].text.replace(/"/g, "");
      let tConId = null;
      if (!activeConversationId) {
        const { data } = await client.post(
          "/messages/conv/new",
          {
            name: query,
          },
          token
        );

        await client.post(
          "/messages/new",
          {
            text: query,
            id: newMessages[0]._id,
            name: "human",
            conversationId: data?.id,
          },
          token
        );
        tConId = data.id;
        setActiveConversationId(data?.id);
      } else {
        await client.post(
          "/messages/new",
          {
            text: query,
            id: newMessages[0]._id,
            name: "human",
            conversationId: activeConversationId,
          },
          token
        );
      }

      try {
        const history = prepareHistory(messages);

        let localResponse = "";

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authrization: `Bearer `,
          },
          body: JSON.stringify({
            query: query,
            history: history,
            messageId: id,
            conversationId: activeConversationId || tConId,
            name: name,
          }),
        };

        const url =
          template == "finance"
            ? `https://api.dutyai.app/chat/finance`
            : template == "forex"
            ? `https://api.dutyai.app/chat/forex`
            : `https://api.dutyai.app/chat/pro`;

        const urlLocal =
          template == "finance"
            ? `http://192.168.0.101:8000/chat/finance`
            : template == "forex"
            ? `http://192.168.0.101:8000/chat/forex`
            : `http://192.168.0.101:8000/chat/pro`;
        es = new EventSource(isRunningInExpoGo ? urlLocal : url, {
          ...options,
          pollingInterval: 0,
        });
        setEventSource(es);
        if (!isStopped) {
          const listener = (event: any) => {
            if (event.type === "open") {
              setTimeLeft(0);
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
                    localResponse
                      ?.toLowerCase()
                      ?.includes("financial summary") ||
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
                      client.post("/tools/get-related-prompt", {
                        query: query,
                        history: `${history.join("\n\n")}`,
                      }),
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
                    client.post("/tools/get-related-prompt", {
                      query: query,
                      history: `${history.join("\n\n")}`,
                    }),
                  ])
                    .then(function (responses) {
                      const { data } = responses[0];

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
              setIsFailed(query);

              console.error("Connection error:", event.message);
              setIsLoading(false);
              setStreaming(false);
            } else if (event.type === "exception") {
              console.error("Error:", event.message, event.error);
              setIsLoading(false);
              setStreaming(false);
              setIsFailed(true);
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
    },
    [messages]
  );

  const stopEventSource = () => {
    setIsStopped(true);
    source.cancel("Request canceled by user");
    setStreaming(false);
    setEventSource(null);
    setIsLoading(false);
    var lastMessage = messages[0];
    if (lastMessage.text === "...") {
      updateMessage(lastMessage._id, "Cancelled...");
    }
    if (eventSource) {
      eventSource.close();
    }
  };

  const onShare = async (text: string) => {
    try {
      const res = await Share.share({
        message: text,
      });
      if (res.action == Share.sharedAction) {
        if (res.activityType) {
          // shared with activity type of result
        } else {
          // shared
        }
      } else if (res.action == Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error);
    }
  };

  const defaultMessage = {
    _id: 1,
    text: "Hi, i'm Duty AI. How can I help?",
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "React Native",
      avatar: "https://picsum.photos/200/300?grayscale",
    },
  };

  const translate = async (text: string, messageId: string) => {
    const sourceLanguage = "auto";
    const targetLanguage = "bn";
    const timeout = 5000;

    try {
      const escapedText = encodeURIComponent(text);
      const url = `https://translate.google.com/m?tl=${targetLanguage}&sl=${sourceLanguage}&q=${escapedText}`;
      const response = await fetch(url);
      const result = await response.text();
      const pattern = /class="(?:t0|result-container)">(.*?)</s;
      const match = result.match(pattern);
      if (match && match[1]) {
        updateMessage(messageId, he.decode(match[1]));
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to translate",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Failed to translate",
      });
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
        onPress={stopEventSource}>
        <Ionicons name="stop-circle-outline" size={32} color="red" />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (activeConversationId) {
      if (!isLoading && !streaming) {
        fetchMessages(activeConversationId);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (isLoading) {
      setRelatedPrompts([]);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(`${user.firstName} ${user.lastName}`);
  }, [user]);

  useEffect(() => {
    if (prompt && !activeConversationId) {
      onSend([
        {
          _id: uuid(),
          createdAt: new Date(),
          text: prompt,
          user: {
            _id: 1,
            avatar: "https://picsum.photos/200/300",
            name: "human",
          },
        },
      ]);
      setPrompt("");
    }
  }, [prompt]);

  useEffect(() => {
    return () => {
      setActiveConversationId(null);
      setTemplate("finance");
    };
  }, []);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{
        flex: 1,
        marginTop: fromPath ? -50 : 0,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}>
        <GiftedChat
          renderChatFooter={() => (
            <>
              {isFailed && (
                <View
                  style={{
                    paddingVertical: 20,
                  }}>
                  <Button
                    onPress={() => {
                      onSend([
                        {
                          _id: uuid(),
                          createdAt: new Date(),
                          text: isFailed,
                          user: {
                            _id: 1,
                            avatar: "https://picsum.photos/200/300",
                            name: "human",
                          },
                        },
                      ]);
                    }}
                    icon="reload"
                    mode="outlined"
                    style={{
                      alignSelf: "center",
                    }}>
                    {isBn ? "পুনরায় চেষ্টা করুন" : "Retry"}
                  </Button>
                </View>
              )}
            </>
          )}
          renderChatEmpty={() => (
            <RenderChatEmpty
              onPressRelated={(prompt: string) => {
                onSend([
                  {
                    _id: uuid(),
                    createdAt: new Date(),
                    text: prompt,
                    user: {
                      _id: 1,
                      avatar: "https://picsum.photos/200/300",
                      name: "human",
                    },
                  },
                ]);
              }}
            />
          )}
          shouldUpdateMessage={(props, nextProps) => messages}
          // isTyping={isLoading}
          disableComposer={isLoading}
          isKeyboardInternallyHandled={false}
          placeholder={
            isLoading
              ? template == "general"
                ? "Generating..."
                : // : timeLeft > 0
                  // ? `Fetching...${timeLeft.toFixed(1)}sec`
                  `Answering...30sec`
              : template == "general"
              ? "Ask anything"
              : template == "finance"
              ? "Enter full company name"
              : "Enter currency pair name"
          }
          onPressActionButton={() => {
            setActiveConversationId(null);
            setRelatedPrompts([]);
          }}
          renderMessageText={(props) => <RenderMessageText {...props} />}
          renderBubble={(props) => (
            <RenderBubble
              {...props}
              bubbleLeftBgColor={bubbleLeftBgColor}
              textColorLeft={textColor}
              relatedPrompts={relatedPrompts}
              isLast={props.currentMessage?._id == modifiedMessages[0]?._id}
              onPressRelated={(prompt: string) => {
                onSend([
                  {
                    _id: uuid(),
                    createdAt: new Date(),
                    text: prompt,
                    user: {
                      _id: 1,
                      avatar: "https://picsum.photos/200/300",
                      name: "human",
                    },
                  },
                ]);
              }}
            />
          )}
          renderInputToolbar={(props) =>
            renderInputToolbar({
              ...props,
              bgColor: inputBgColor,
              borderColor: borderColor,
            })
          }
          renderComposer={(props) =>
            renderComposer({
              ...props,
              textColor: textColor,
              bgColor: inputBgColor,
              borderColor: borderColor,
            })
          }
          renderActions={(props) =>
            renderActions({
              ...props,
              textColor: textColor,
              isLoading,
              streaming,
            })
          }
          renderSend={(props) =>
            streaming || isLoading
              ? stopButton()
              : renderSend({
                  ...props,
                  bgColor: props.text ? primaryColor : primaryColor,
                })
          }
          renderAvatar={() => null}
          renderMessage={(props) => renderMessage({ ...props })}
          messages={modifiedMessages}
          alignTop={false}
          listViewProps={{
            contentContainerStyle: {
              flexGrow: 1,
              justifyContent: "flex-end",
            },
          }}
          messagesContainerStyle={{
            paddingBottom: 12,
          }}
          // bottomOffset={Platform.OS === "ios" ? tabBarHeight - 16 : 0}
          showUserAvatar={false}
          onSend={(newMessages: any) => {
            onSend(newMessages);
          }}
          user={{
            _id: 1,
            name: "human",
            avatar: "https://picsum.photos/200/300",
          }}
          onLongPress={(context, message) => {
            const options = ["Copy", "Share", "Cancel"];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
              },
              async (buttonIndex: any) => {
                switch (buttonIndex) {
                  case 0:
                    await Clipboard.setStringAsync(message.text);
                    Toast.show({
                      type: "success",
                      text1: "Copied to clipboard",
                    });
                    break;
                  case 1:
                    await onShare(message.text);
                    break;
                }
              }
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
