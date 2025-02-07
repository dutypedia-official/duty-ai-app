import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import useChat from "@/lib/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

export default function ChatScreen() {
  const { fromPath } = useLocalSearchParams();
  const { setActiveConversationId, setTemplate, template } = useChat();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && template == "portfolio") {
      setActiveConversationId(null);
      setTemplate("general");
    }
  }, [isFocused, template]);

  return <ChatTurbo fromPath={fromPath} />;
}
