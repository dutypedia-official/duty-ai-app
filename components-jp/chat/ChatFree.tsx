import {
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, Text, useThemeColor } from "../../components/Themed";
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
import { Tabs } from "expo-router";
import { apiClient } from "@/lib/api";
import { v4 as uuid } from "uuid";
import EventSource from "react-native-sse";
import { Button } from "react-native-paper";
import {
  containsNonEnglish,
  duckSearch,
  fetchWithTimeout,
  getClassify,
  translate,
} from "@/lib/utils";
import axios from "axios";
import he from "he";
import useLang from "@/lib/hooks/useLang";
import { ProgressBar } from "react-native-paper";
import ChatProgress from "./Progress";
import { useAuth } from "@clerk/clerk-expo";
import useChat from "@/lib/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";

export default function ChatFree() {
  const { getToken } = useAuth();
  const [cancelTokenSource, setCancelTokenSource] = useState<any>(null);
  const { activeConversationId, setActiveConversationId } = useChat();
  const [messages, setMessages] = useState<any>([]);
  const [progress, setProgress] = useState(0);
  const { autoTranslateTo, isTranslate } = useLang();
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
  const client = apiClient();
  let pMessage: any = "";
  const modifiedMessages = messages.map((message: any) => ({
    ...message,
    _id: message.id || message._id,
  }));
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

  const optimizeQuery = async (query: string) => {
    const history = prepareHistory(messages);
    if (history.length === 0) {
      return query;
    }
    if (
      query.toLowerCase() == "hi" ||
      query.toLowerCase() == "hey" ||
      query.toLowerCase() == "hello"
    ) {
      return query;
    }
    let historyStr = "Chat history: \n";
    history.slice(-4).forEach((h: any) => {
      if (h.human) {
        historyStr += `HUMAN: ${h.human}\n`;
      } else if (h.ai) {
        historyStr += `AI: ${h.ai}\n`;
      }
    });
    try {
      const { data } = await client.post("/tools/optimize-search-query", {
        query: query,
        history: historyStr,
      });
      return data;
    } catch (error) {
      console.log(error);
      return query;
    }
  };

  const onSend = useCallback(
    async (newMessages: any = []) => {
      const token = await getToken();
      setMessages((previousMessages: never[] | undefined) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      setIsLoading(true);
      const id = uuid();
      setMessages((previousMessages: never[] | undefined) =>
        GiftedChat.append(previousMessages, [
          {
            _id: id,
            text: "...",
            createdAt: new Date(),
            tag,
            streaming: true,
            user: {
              _id: 2,
              name: "ai",
              avatar: "https://picsum.photos/200/300?grayscale",
            },
          },
        ])
      );
      const query = await optimizeQuery(newMessages[0].text);

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
      console.log(query);
      const tag = await getClassify(query);
      console.log(tag);

      let duckResult = null;

      if (tag != "general") {
        updateMessage(id, "Searching...");
        duckResult = await duckSearch(query.replace(/"/g, ""));
      }

      try {
        const history = prepareHistory(messages);
        if (tag != "general") {
          updateMessage(id, "Generating answer...");
        }
        const source = axios.CancelToken.source();
        setCancelTokenSource(source);

        const { data } = await axios.post(
          `https://api.dutyai.app/web/`,
          {
            query: newMessages[0].text,
            duckResult: duckResult,
            history: history,
            tag: tag,
            messageId: id,
            conversationId: activeConversationId || tConId,
          },
          {
            cancelToken: source.token,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Promise.all([
          client.post("/tools/get-related-prompt", {
            query: query,
          }),
        ])
          .then(async function (responses) {
            const { data } = responses[0];
            if (autoTranslateTo != null && isTranslate) {
              for (let i = 0; i < data.length; i++) {
                const translatedText = await translate(
                  data[i].prompt,
                  autoTranslateTo
                );
                if (translatedText != null) {
                  data[i].prompt = translatedText;
                }
              }

              setRelatedPrompts(data);
            } else {
              setRelatedPrompts(data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });

        if (autoTranslateTo != null && isTranslate) {
          const translatedText = await translate(data.answer, autoTranslateTo);
          if (translatedText != null) {
            await client.post(
              "/messages/update",
              {
                id: id,
                text: translatedText,
              },
              token
            );
            updateMessage(id, translatedText);
          }
        } else {
          updateMessage(id, data.answer);
        }
        setProgress(1);
      } catch (error) {
        console.log(error);
        updateMessage(id, "Sorry, something went wrong!");
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

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

  const stopButton = () => {
    return (
      <TouchableOpacity
        style={{
          width: 32,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          if (cancelTokenSource) {
            cancelTokenSource.cancel("Request canceled by user");
          }
          setIsLoading(false);
          var lastMessage = messages[0];
          if (lastMessage.text === "...") {
            updateMessage(lastMessage._id, "Cancelled...");
          }
        }}
      >
        <Ionicons name="stop-circle-outline" size={32} color="red" />
      </TouchableOpacity>
    );
  };

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
    if (activeConversationId) {
      if (!isLoading) {
        fetchMessages(activeConversationId);
      }
    } else {
      setMessages([defaultMessage]);
    }
  }, [activeConversationId]);

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
          renderChatFooter={() =>
            isLoading && <ChatProgress isLoading={isLoading} />
          }
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
            })
          }
          renderSend={(props) =>
            isLoading
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
          onSend={(newMessages: any) => onSend(newMessages)}
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
