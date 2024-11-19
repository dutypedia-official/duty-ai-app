import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import useChat from "@/lib/hooks/useChat";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function ChatScreen() {
  const isFocused = useIsFocused();
  const { setActiveConversationId, setTemplate, template } = useChat();

  useEffect(() => {
    if (isFocused && template !== "finance") {
      setActiveConversationId(null);
      setTemplate("finance");
    }
  }, [isFocused]);

  return <ChatTurbo key={template} />;
}
