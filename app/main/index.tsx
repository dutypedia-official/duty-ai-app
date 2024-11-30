import ChatTurbo from "@/components/chat/turbo/ChatTurbo";
import { SafeAreaView, Text, View } from "@/components/Themed";
import useChat from "@/lib/hooks/useChat";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ChatScreen() {
  const isFocused = useIsFocused();
  const { setActiveConversationId, setTemplate, template } = useChat();

  useEffect(() => {
    if (isFocused && template !== "finance") {
      setActiveConversationId(null);
      setTemplate("finance");
    }
  }, [isFocused]);

  // return <ChatTurbo key={template} />;
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.push("/update/")}>
        <View>
          <Text style={{ color: "red" }}>Update</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
