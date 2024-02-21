import {
  KeyboardAvoidingView,
  Platform,
  Share,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, useThemeColor } from "../../components/Themed";
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
import { containsNonEnglish, fetchWithTimeout, getClassify } from "@/lib/utils";
import he from "he";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import useChat from "@/lib/hooks/useChat";

const source = axios.CancelToken.source();

export default function ChatPro() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const { activeConversationId, setActiveConversationId } = useChat();
  const [eventSource, setEventSource] = useState<any>(null);
  const [name, setName] = useState("");
  const [isStopped, setIsStopped] = useState(false);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([]);
  const [relatedPrompts, setRelatedPrompts] = useState([]);
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
  const [messageToUpdate, setMessageToUpdate] = useState<any>(null);
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
      const token = await getToken();
      setIsStopped(false);
      setMessages((previousMessages: never[] | undefined) =>
        GiftedChat.append(previousMessages, newMessages)
      );
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

        let localResponse = "";
        es = new EventSource(`${process.env.EXPO_PUBLIC_API_URL}/chat/pro`, {
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
                localResponse = localResponse + " " + data;
                updateMessage(id, localResponse);
              } else {
                setIsLoading(false);
                console.log("Done!");

                Promise.all([
                  client.post("/tools/get-related-prompt", {
                    query: query,
                  }),
                ])
                  .then(function (responses) {
                    const { data } = responses[0];
                    setRelatedPrompts(data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
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
        onPress={stopEventSource}
      >
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
      setMessages([defaultMessage]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    setMessages([defaultMessage]);
  }, []);

  useEffect(() => {
    if (messageToUpdate) {
      updateMessage(messageToUpdate.id, messageToUpdate.text);
    }
  }, [messageToUpdate]);

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

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <GiftedChat
          shouldUpdateMessage={(props, nextProps) => messages}
          // isTyping={isLoading}
          disableComposer={isLoading}
          isKeyboardInternallyHandled={false}
          placeholder="Ask any question..."
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
            const options = ["Copy", "Translate", "Share", "Cancel"];
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
                    //code to translate
                    await translate(message.text, `${message._id}`);
                    break;
                  case 2:
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
