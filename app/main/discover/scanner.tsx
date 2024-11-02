import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import useChat from "@/lib/hooks/useChat";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";

const ScannerPage = () => {
  const { setTemplate } = useChat();
  const pathname = usePathname();

  console.log(pathname);
  useEffect(() => {
    if (pathname.includes("/main/discover/scanner")) {
      setTemplate("scanner");
    }
  }, []);

  return <ChatTurbo />;
};

export default ScannerPage;
