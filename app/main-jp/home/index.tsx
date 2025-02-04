import ChatTurbo from "@/components-jp/chat/turbo/ChatTurbo";
import { SafeAreaView, Text, View } from "@/components/Themed";
import useChat from "@/lib/hooks/useChat";
import useVipSignal from "@/lib/hooks/useVipSignal";
import { useIsFocused } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ChatScreen() {
  const isFocused = useIsFocused();
  const { setActiveConversationId, setTemplate, template } = useChat();
  const { setAnswer, clearSelectStock } = useVipSignal();

  useEffect(() => {
    setActiveConversationId(null);
    setTemplate("finance");
  }, [isFocused]);

  // useEffect(() => {
  //   if (isFocused && template !== "finance") {
  //     setActiveConversationId(null);
  //     setTemplate("finance");
  //   }
  // }, [isFocused]);

  useEffect(() => {
    clearSelectStock();
    setAnswer(null);
  }, [isFocused]);

  console.log("jp-layout", usePathname());
  return <ChatTurbo key={template} />;
}
