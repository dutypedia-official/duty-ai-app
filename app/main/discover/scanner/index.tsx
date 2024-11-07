import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import useChat from "@/lib/hooks/useChat";
import { useIsFocused } from "@react-navigation/native";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";

const ScannerPage = () => {
  const { setTemplate, template } = useChat();
  const pathname = usePathname();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (template !== "scanner") {
      setTemplate("scanner");
    }
  }, [isFocused]);

  return <ChatTurbo key={template} />;
};

export default ScannerPage;
