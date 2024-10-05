import {
  Dimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View, useThemeColor } from "../Themed";
import useChat from "@/lib/hooks/useChat";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import useLang from "@/lib/hooks/useLang";

const RenderChatEmpty = ({ onPressRelated }: any) => {
  const borderColor = useThemeColor({}, "border");
  const { activeConversationId, setActiveConversationId, template } = useChat();
  const bubbleLeftBgColor = useThemeColor({}, "bubbleLeftBg");
  const { user } = useUser();
  const [name, setName] = useState("");
  const { language, setLanguage } = useLang();
  const isBn = language === "Bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";

  const generalPrompts = [
    "📰 Top news bangladesh",
    "⚽ Today top sports news",
    "💡 Give me a online business idea",
    "🏠 Remote Work Opportunities",
    "✈️ Budget Travel Tips",
  ];
  const generalPromptsBn = [
    "📰 বাংলাদেশের শীর্ষ সংবাদ",
    "⚽ আজকের সেরা ক্রীড়া খবর",
    "💡 একটি অনলাইন ব্যবসার ধারণা দাও",
    "🏠 রিমোট কাজের সুযোগ",
    "✈️ বাজেট ভ্রমণ টিপস",
  ];

  const financePrompts = [
    "📰 Bangladesh stock market news",
    "📱 Should I Invest in GP BD",
    "💊 Should I Invest in BEXIMCO BD",
    "🏦 Should I Invest in Brac Bank BD",
    "👚 Should I Invest in FEKDIL BD",
  ];

  const forexPrompts = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/GBP"];

  const prompts =
    template == "general"
      ? isBn
        ? generalPromptsBn
        : generalPrompts
      : template == "forex"
      ? forexPrompts
      : financePrompts;

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(`${user.firstName}`);
  }, [user]);
  return (
    <View
      style={{
        // transform:
        //   Platform.OS === "ios" ? "scaleY(-1)" : "scaleX(-1) scaleY(-1)",
        paddingVertical: 20,
        flex: 1,
        justifyContent: "center",
        height: Dimensions.get("window").height - 200,
      }}>
      <View style={{ marginBottom: 40 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 40, fontWeight: "700", lineHeight: 40 }}>
          Hello, {name}
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "400",
            opacity: 0.5,
          }}>
          {template == "finance"
            ? "Let's chat about stocks!"
            : "How can I help you today?"}
        </Text>
      </View>
      {prompts.map((prompt, i) => (
        <TouchableOpacity
          key={i}
          style={{ marginBottom: 16 }}
          onPress={() => {
            onPressRelated(prompt);
          }}>
          <View
            style={{
              //   borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              alignSelf: "center",
              width: "100%",
              backgroundColor: isDark ? bubbleLeftBgColor : "white",
            }}>
            <Text style={{ opacity: 0.5, fontSize: 20 }} numberOfLines={2}>
              {prompt}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RenderChatEmpty;
