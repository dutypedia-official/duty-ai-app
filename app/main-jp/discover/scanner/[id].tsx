import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import useChat from "@/lib/hooks/useChat";
import { useIsFocused } from "@react-navigation/native";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";

export default function Details() {
  const { setTemplate, template, setPrevId, setActiveConversationId } =
    useChat();
  const pathname = usePathname();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (template !== "scanner") {
      setTemplate("scanner");
    }
  }, [isFocused]);

  return <ChatTurbo key={template} />;
}
