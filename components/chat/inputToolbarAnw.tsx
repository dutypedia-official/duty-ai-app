import React from "react";
import { Image, Platform, View } from "react-native";
import {
  InputToolbar,
  Bubble,
  Actions,
  Composer,
  Send,
} from "react-native-gifted-chat";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export const renderInputToolbar = (props: any) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: "transparent",
      borderTopWidth: 0,
      marginHorizontal: 0,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderTopColor: props.borderColor || "#E4E9F2",
    }}
    primaryStyle={{ alignItems: "flex-end", gap: 8 }}
  />
);

export const renderActions = (props: any) => (
  <Actions
    {...props}
    containerStyle={{
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 0,
      opacity: 0.5,
    }}
    icon={() => (
      <MaterialIcons
        name="post-add"
        size={28}
        color={props.textColor || "#fff"}
      />
    )}
  />
);

export const renderComposer = (props: any) => (
  <View
    style={{
      flexDirection: "row",
      borderWidth: 1,
      flex: 1,
      alignItems: "flex-end",
      gap: 4,
      backgroundColor: props.bgColor || "#EDF1F7",
      borderRadius: 22,
      borderColor: props.borderColor || "#E4E9F2",
      paddingHorizontal: 8,
    }}
  >
    <MaterialIcons
      name="post-add"
      size={28}
      color={props.textColor || "#fff"}
      style={{ paddingBottom: 6, opacity: 0.5 }}
    />
    <Composer
      {...props}
      textInputStyle={{}}
      textInputProps={{
        style: {
          color: props.textColor || "#222B45",

          flex: 1,

          paddingHorizontal: 12,
          paddingTop: Platform.OS == "ios" ? 12 : 6,
          paddingBottom: Platform.OS == "ios" ? 12 : 6,
          marginLeft: 0,
        },
      }}
    />
  </View>
);

export const renderSend = (props: any) => (
  <Send
    {...props}
    disabled={!props.text}
    alwaysShowSend={true}
    containerStyle={{
      width: 40,
      height: 40,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: props.bgColor || "blue",
      marginBottom: 2,
    }}
  >
    <Ionicons name="send" size={20} color={"#fff"} />
  </Send>
);

export const renderBubble = (props: any) => (
  <Bubble
    {...props}
    textStyle={{
      left: { color: props.textColorLeft || "#fff" },
    }}
    wrapperStyle={{
      left: { backgroundColor: props.bubbleLeftBgColor || "#1A1D1C" },
      right: {},
    }}
  />
);
