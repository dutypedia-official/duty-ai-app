import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  InputToolbar,
  Bubble,
  Actions,
  Composer,
  Send,
  Message,
  MessageText,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, useThemeColor } from "../Themed";
import Markdown from "react-native-markdown-display";
import { Switch } from "react-native-paper";
import { apiClient } from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Constants from "expo-constants";

export const renderInputToolbar = (props: any) => (
  <>
    <InputToolbar
      {...props}
      containerStyle={[
        {
          backgroundColor: props.bgColor,
          marginHorizontal: 0,
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderBottomColor: props.borderColor,
          borderTopColor: props.borderColor,
        },
      ]}
      primaryStyle={[
        { alignItems: "flex-end", justifyContent: "center", gap: 8 },
      ]}
    />
  </>
);

export const renderActions = (props: any) => (
  <Actions
    {...props}
    containerStyle={{
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 0,
      opacity: props.isLoading || props.streaming ? 0.3 : 1,
      pointerEvents: props.isLoading || props.streaming ? "none" : "auto",
    }}
    icon={() => <MaterialIcons name="post-add" size={28} color={"#0C9462"} />}
  />
);

export const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{
      color: props.textColor || "#222B45",
      paddingTop: Platform.OS == "ios" ? 8 : 6,
    }}
  />
);

export const renderMessage = (props: any) => (
  <Message
    {...props}
    containerStyle={{
      left: {
        marginLeft: 0,
      },
      right: {},
    }}
    linkStyle={{
      right: {
        color: "#c2cafc",
      },
      left: {
        color: "aqua",
      },
    }}
  />
);

export const renderSend = (props: any) => (
  <Send
    {...props}
    disabled={!props.text}
    alwaysShowSend={true}
    containerStyle={{
      paddingBottom: 7,
    }}
  >
    <Ionicons
      style={{ opacity: props.text ? 1 : 0.3 }}
      name="send"
      size={28}
      color={"#0C9462"}
    />
  </Send>
);

export const RenderBubble = (props: any) => {
  const borderColor = useThemeColor({}, "border");

  return (
    <View>
      <Bubble
        {...props}
        textStyle={{
          left: { color: props.textColorLeft || "#fff" },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: props.bubbleLeftBgColor || "#1A1D1C",
            marginRight: 16,
          },
          right: {},
        }}
      />
      {props.relatedPrompts?.length > 0 && props.isLast && (
        <View style={{ gap: 8, flex: 1, marginRight: 12, marginVertical: 8 }}>
          {props.relatedPrompts.map((p: any, i: number) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                props.onPressRelated(p.label || p.prompt || p.question)
              }
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
};

export const RenderMessageText = (props: any) => {
  const { currentMessage, previousMessage } = props;
  const textColor = useThemeColor({}, "text");
  const [dots, setDots] = useState("•");
  const [isSwitchOn, setIsSwitchOn] = React.useState(
    currentMessage.FeedMessage ? true : false
  );
  const client = apiClient();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  const onToggleSwitch = async () => {
    if (!previousMessage || isLoading || !user) return;
    try {
      setIsLoading(true);
      const currentValue = isSwitchOn;
      setIsSwitchOn(!isSwitchOn);
      const token = await getToken();
      if (!currentValue) {
        const { data } = await client.post(
          "/messages/add-to-feed",
          {
            messageId: currentMessage._id,
            question: previousMessage.text,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            profilePhoto: user.imageUrl,
          },
          token
        );
        console.log(data);
      } else {
        const { data } = await client.post(
          `/messages/delete-from-feed/${currentMessage._id}`,

          {},
          token
        );
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        return prevDots.length < 3 ? prevDots + "•" : "•";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);
  const text =
    currentMessage?.user?._id !== 1 ? (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          maxWidth: Dimensions.get("window").width - 38,
        }}
      >
        <Markdown
          style={{
            body: {
              color: currentMessage?.user?._id == 1 ? "white" : textColor,

              flexShrink: 1,
            },
            paragraph: {
              fontSize: 16,
            },
            heading1: {
              marginVertical: 5,
            },
            heading2: {
              marginTop: 20,
            },
            heading3: {
              marginTop: 20,

              marginBottom: 5,
            },
            heading4: {
              marginTop: 10,

              marginBottom: 5,
            },
            heading5: {
              marginTop: 10,

              marginBottom: 5,
            },
            heading6: {
              marginVertical: 5,
            },
            list_item: {
              marginTop: 7,

              fontSize: 16,
            },
            ordered_list_icon: {
              fontSize: 16,
            },
            bullet_list: {
              marginTop: 10,
            },
            ordered_list: {
              marginTop: 7,
            },
            bullet_list_icon: {
              color: textColor,
              fontSize: 16,
            },
            code_inline: {
              color: "white",
              backgroundColor: "black",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, .1)",
            },
            hr: {
              backgroundColor: "rgba(255, 255, 255, .1)",
              height: 1,
            },
            fence: {
              marginVertical: 5,
              padding: 10,
              color: "white",
              backgroundColor: "black",
              borderColor: "#484a49",
            },
            tr: {
              borderBottomWidth: 1,
              borderColor: "#484a49",
              flexDirection: "row",
            },
            table: {
              marginTop: 7,
              borderWidth: 1,
              borderColor: "#484a49",
              borderRadius: 3,
            },
            blockquote: {
              backgroundColor: "#312e2e",
              borderColor: "#CCC",
              borderLeftWidth: 4,
              marginLeft: 5,
              paddingHorizontal: 5,
              marginVertical: 5,
            },
          }}
        >
          {currentMessage.text}
        </Markdown>
      </View>
    ) : (
      currentMessage.text
    );

  if (currentMessage.text === "...") {
    return (
      <Text
        style={{
          paddingHorizontal: 8,
          fontSize: 24,
        }}
      >
        {dots}
      </Text>
    );
  }

  return (
    <View>
      <MessageText
        {...props}
        currentMessage={{ ...currentMessage, text: text }}
      />
      {/* {currentMessage?.user?._id != 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: Constants.platform?.ios ? 8 : 0,
          }}
        >
          <Text style={{ color: "#0C9462" }}>Add to feed</Text>
          <Switch
            color="#0C9462"
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            style={{
              transform: [
                { scaleX: Constants.platform?.ios ? 0.8 : 1 },
                { scaleY: Constants.platform?.ios ? 0.8 : 1 },
              ],
            }}
          />
        </View>
      )} */}
    </View>
  );
};
