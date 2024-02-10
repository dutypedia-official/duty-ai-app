import React, { useEffect, useState } from "react";
import { Image, Platform, TouchableOpacity, View } from "react-native";
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
import { TypingAnimation } from "react-native-typing-animation";
import Markdown from "react-native-markdown-display";

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
              onPress={() => props.onPressRelated(p.prompt || p.question)}
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
  const { currentMessage } = props;
  const textColor = useThemeColor({}, "text");

  const text = (
    <Markdown
      style={{
        text: {
          color: textColor,
        },
      }}
    >
      {currentMessage.text}
    </Markdown>
  );

  if (currentMessage.text === "...") {
    return (
      <Text style={{ paddingVertical: 4, marginTop: -8, paddingBottom: 12 }}>
        <TypingAnimation dotX={20} dotMargin={4} dotColor={textColor} />
      </Text>
    );
  }

  return <MessageText {...props} currentMessage={{ ...currentMessage }} />;
};
