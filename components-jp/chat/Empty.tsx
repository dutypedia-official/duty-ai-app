import useChat from "@/lib/hooks/useChat";
import useLang from "@/lib/hooks/useLang";
import { useUser } from "@clerk/clerk-expo";
import Entypo from "@expo/vector-icons/Entypo";
import { usePathname, useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import MagicIcon from "../svgs/magic";
import { Text, View, useThemeColor } from "../Themed";

const RenderChatEmpty = ({ onPressRelated }: any) => {
  const borderColor = useThemeColor({}, "border");
  const { template, setTemplate } = useChat();
  const bubbleLeftBgColor = useThemeColor({}, "bubbleLeftBg");
  const { user } = useUser();
  const [name, setName] = useState("");
  const { language, setLanguage } = useLang();
  const isBn = language === "bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const videoUrl = "https://www.youtube.com/embed/c6fZbt9zaOM?autoplay=1";
  const injectedJavaScript = `
    document.getElementsByTagName('video')[0].play();
    var iframe = document.querySelector('iframe');
    iframe.requestFullscreen();
  `;
  const pathname = usePathname();

  const generalPrompts = [
    "📰 今日の注目ニュースは何ですか？",
    "⚽ 今日のトップスポーツニュースは何ですか？",
    "💡 オンラインビジネスのアイデアを教えてください。",
    "🏠 リモートワークの機会について教えてください。",
    "✈️ お得に旅行するためのヒントを教えてください。",
  ];
  const generalPromptsBn = [""];

  const financePrompts = [
    "📰 日本株式マーケットニュース",
    "📱 トヨタに投資すべきか",
    "📊 今日の指数について教えてください。",
    // "▶️ Duty AI ビデオチュートリアル",
    "🔍 ストックスキャナー",
    "⚖️ ゴールデン チョイス",
  ];

  const forexPrompts = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/GBP"];

  const stockScreener = [
    "📅 明日はどのセクターが好パフォーマンスを発揮しますか？",
    "💰 最高の配当を出す銘柄はどれですか？",
    "💸 安い価格で良いポテンシャルを持つ株を教えてください。",
    "📊 今買うべき株はどれですか？",
    "🔥 今日のトップパフォーマンス銘柄は何ですか？",
    "⏳ 短期向けの銘柄をいくつか教えてください。",
  ];

  const promptsFn = () => {
    if (template == "general") {
      return isBn ? generalPromptsBn : generalPrompts;
    } else if (template == "forex") {
      return forexPrompts;
    } else if (template == "finance") {
      return financePrompts;
    } else if (template == "scanner") {
      return stockScreener;
    } else {
      return isBn ? generalPromptsBn : generalPrompts;
    }
  };

  const subTitleFn = () => {
    if (template == "general") {
      return "今日はどのようにお手伝いできますか？";
    } else if (template == "forex") {
      return "FXについて話しましょう";
    } else if (template == "finance") {
      return "株式について話しましょう";
    } else if (template == "scanner") {
      return "銘柄スクリーニング";
    } else {
      return "今日はどのようにお手伝いできますか？";
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(`${user.firstName}`);
  }, [user]);
  return (
    <Fragment>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={
            {
              // paddingHorizontal: 12,
            }
          }>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.85,
              backgroundColor: isDark ? "black" : "white",
            }}>
            {loading && (
              <View
                style={
                  {
                    // width: Dimensions.get("window").width - 24,
                    // height: Dimensions.get("window").width / videoAspectRatio,
                  }
                }>
                <ActivityIndicator
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </View>
            )}
            <WebView
              style={{
                height: Dimensions.get("window").width,
                flex: 1,
                backgroundColor: isDark ? "black" : "white",
              }}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onLoadEnd={() => setLoading(false)}
              onError={() => setLoading(false)}
              javaScriptEnabled={true}
              allowsFullscreenVideo={true}
              source={{
                uri: videoUrl,
              }}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              injectedJavaScript={injectedJavaScript}
              onMessage={(event) => {
                if (
                  Platform.OS === "android" &&
                  event.nativeEvent.data === "enterFullScreen"
                ) {
                  setVisible(false);
                  setTimeout(() => setVisible(true), 0);
                }
              }}
            />
          </View>
        </Modal>
      </Portal>
      <View
        style={{
          // transform:
          //   Platform.OS === "ios" ? "scaleY(-1)" : "scaleX(-1) scaleY(-1)",
          paddingVertical: template == "scanner" ? 0 : 20,
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          height: Dimensions.get("window").height - 200,
          backgroundColor: "transparent",
          marginTop: template === "scanner" ? insets.top + 28 : 0,
        }}>
        <View
          style={{
            marginBottom: 40,
            backgroundColor: "transparent",
            paddingTop: template !== "scanner" ? insets.top : 0,
          }}>
          {template !== "scanner" ? (
            <Text
              style={{
                fontSize: 40,
                fontWeight: "700",
                lineHeight: 40,
              }}>
              こんにちは, {name}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 40,
                fontWeight: "700",
                lineHeight: 40,
                color: "#6EA8D5",
              }}>
              こんにちは, {name}
            </Text>
          )}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "400",
              opacity: 0.5,
            }}>
            {subTitleFn()}
          </Text>
        </View>

        {promptsFn().map((prompt, i) => {
          const promptPress = (val: any) => {
            if (val.includes("▶️ Duty AI ビデオチュートリアル")) {
              setVisible(true);
            } else if (val.includes("⚖️ ゴールデン チョイス")) {
              router.push("/main-jp/home/vipsignal/list");
            } else if (val.includes("🔍 ストックスキャナー")) {
              router.push({
                pathname: "/main-jp/home/scanner",
              });
            } else {
              onPressRelated(prompt);
            }
          };

          const borderWidthDiff = (val: any) => {
            if (val.includes("🔍 ストックスキャナー")) {
              return isDark ? 1 : 2;
            } else if (val.includes("⚖️ ゴールデン チョイス")) {
              return isDark ? 1 : 2;
            } else {
              return isDark ? 1 : 1;
            }
          };

          const borderColorDiff = (val: any) => {
            if (val.includes("🔍 ストックスキャナー")) {
              return isDark ? "#5BBAB2" : "#4A90E2";
            } else if (val.includes("⚖️ ゴールデン チョイス")) {
              return isDark ? "#BCAA63" : "#FFD700";
            } else {
              return isDark ? "#2A2A2A" : "#D6D6D6";
            }
          };
          return (
            <TouchableOpacity
              key={i}
              style={{ marginBottom: 16 }}
              onPress={() => promptPress(prompt)}>
              <View
                style={{
                  borderWidth:
                    template === "scanner" ? 1.5 : borderWidthDiff(prompt),
                  borderColor:
                    template === "scanner"
                      ? isDark
                        ? "#3A7CA5"
                        : "#8AB4C9"
                      : borderColorDiff(prompt),
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  alignSelf: "center",
                  width: "100%",
                  backgroundColor:
                    template === "scanner"
                      ? isDark
                        ? "#2D2F34"
                        : "#E8ECEF"
                      : isDark
                      ? "#141414"
                      : "white",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    opacity: template === "scanner" ? 1 : 0.8,
                    fontSize: 18,
                    width: prompt.includes("⚖️ ゴールデン チョイス")
                      ? "90%"
                      : "auto",
                  }}
                  numberOfLines={2}>
                  {prompt}
                </Text>

                {prompt.includes("⚖️ ゴールデン チョイス") && (
                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color={isDark ? "#565656" : "#A4A1A1"}
                  />
                )}
                {prompt.includes("🔍 ストックスキャナー") && (
                  <MagicIcon
                    style={{
                      width: 20,
                      height: 20,
                      alignSelf: "center",
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Fragment>
  );
};

export default RenderChatEmpty;
