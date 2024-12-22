import {
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
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
  fetchWithTimeout,
  getClassify,
  translate,
} from "@/lib/utils";
import axios from "axios";
import he from "he";
import useLang from "@/lib/hooks/useLang";

export default function ChatFreeStreaming() {
  const [messages, setMessages] = useState<any>([]);
  const { autoTranslateTo } = useLang();
  const [relatedPrompts, setRelatedPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const duckSearch = async (query: string) => {
    try {
      const apiUrl = "https://html.duckduckgo.com/html";
      const params: any = {
        q: `${query} -youtube.com -facebook.com -portalsbd.com -pornhub.com -accuweather.com`,
        kl: "us-en",
        ex: "-2",
      };

      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");

      const urlWithParams = `${apiUrl}?${queryString}`;

      const headers = new Headers({
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      });

      const res = await fetchWithTimeout(urlWithParams, {
        method: "GET",
        headers: headers,
      });
      const html = await res.text();

      return html;
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "info",
        text1: "Warning",
        text2: "Can't connect to internet!",
      });
      return "";
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

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authrization: `Bearer `,
          },
          body: JSON.stringify({
            query: newMessages[0].text,
            duckResult: duckResult,
            history: history,
            tag: tag,
          }),
        };

        let localResponse = "";
        const es = new EventSource(`https://www.dutyai.app/web/stream`, {
          ...options,
        });

        const listener = async (event: any) => {
          if (event.type === "open") {
            console.log("Open SSE connection.");
            setIsLoading(false);
          } else if (event.type === "message") {
            if (event.data !== "[DONE]") {
              const data = event.data;
              if (pMessage !== JSON.parse(data).token.id) {
                localResponse =
                  localResponse + JSON.parse(data).choices[0].text;
                updateMessage(id, localResponse.trimStart());
              }
              pMessage = JSON.parse(data).token.id;
            } else {
              setIsLoading(false);
              if (autoTranslateTo != null && autoTranslateTo != "en") {
                const translatedText = await translate(
                  localResponse,
                  autoTranslateTo
                );
                if (translatedText != null) {
                  updateMessage(id, translatedText);
                }
              }
              console.log("Done!");

              Promise.all([
                client.post("/tools/get-related-prompt", {
                  query: query,
                }),
              ])
                .then(function (responses) {
                  const { data } = responses[0];
                  console.log(data);

                  setRelatedPrompts(data);
                })
                .catch(function (error) {
                  console.log(error);
                });
              es.close();
            }
          } else if (event.type === "error") {
            console.error("Connection error:", event.message);
            setIsLoading(false);
          } else if (event.type === "exception") {
            console.error("Error:", event.message, event.error);
            setIsLoading(false);
          }
        };

        es.addEventListener("open", listener);
        es.addEventListener("message", listener);
        es.addEventListener("error", listener);
      } catch (error) {
        console.log(error);
      } finally {
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
            setMessages([defaultMessage]);
            setRelatedPrompts([]);
          }}
          renderMessageText={(props) => <RenderMessageText {...props} />}
          renderBubble={(props) => (
            <RenderBubble
              {...props}
              bubbleLeftBgColor={bubbleLeftBgColor}
              textColorLeft={textColor}
              relatedPrompts={relatedPrompts}
              isLast={props.currentMessage?._id == messages[0]?._id}
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
              bgColor: chatContainerBgColor,
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
            renderActions({ ...props, textColor: textColor })
          }
          renderSend={(props) =>
            renderSend({
              ...props,
              bgColor: props.text ? primaryColor : primaryColor,
            })
          }
          renderAvatar={() => null}
          renderMessage={(props) => renderMessage({ ...props })}
          messages={messages}
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
