import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import useMarket from "@/lib/hooks/useMarket";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Fragment, useEffect } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView, View } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { useIsFocused } from "@react-navigation/native";

export default function StartScreen() {
  const isFocused = useIsFocused();
  const { setSelectMarket } = useMarket();
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const videoSource = require("@/assets/video/background.mp4");

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (isFocused) {
      // If the screen is focused, play the video
      player.play();
    } else {
      // If the screen is not focused, pause the video
      player.pause();
    }
  }, [isFocused, player]);

  const languages = [
    {
      value: "bn",
      label: "বাংলা",
    },
    {
      value: "ja",
      label: "日本語",
    },
    {
      value: "en",
      label: "English",
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}>
      <StatusBar style="light" />
      <VideoView
        player={player}
        contentFit={"fill"}
        nativeControls={false}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          backgroundColor: isDark ? "#06112D" : "#FFFFFF",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "instruct2",
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "transparent",
              gap: 24,
            }}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
              }}>
              <Fragment>
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 56,
                    color: "#A58AFF",
                    textShadowColor: "rgba(255, 255, 255, 0.34)",
                    textShadowOffset: { width: 4, height: 2 },
                    textShadowRadius: 8,
                  }}>
                  AI
                </Text>
                <Text
                  style={{
                    fontWeight: "900",
                    fontSize: 56,
                    color: "#fff",
                    textShadowColor: "rgba(255, 255, 255, 0.34)",
                    textShadowOffset: { width: 4, height: 2 },
                    textShadowRadius: 8,
                  }}>
                  株式分析
                </Text>
              </Fragment>
            </View>
            <View
              style={{
                backgroundColor: "rgba(79, 135, 215, 0.7)",
                padding: 10,
                justifyContent: "center",
                alignContent: "center",
                borderRadius: 1000,
                paddingHorizontal: 12,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#fff",
                  textAlign: "center",
                }}>
                Duty AI
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                gap: 12,
              }}>
              <Image
                style={{
                  height: Dimensions.get("window").height * 0.24,
                  width: Dimensions.get("window").width,
                }}
                resizeMode="contain"
                source={require("../../assets/animations/laptop.gif")}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setSelectMarket("");
            router.push("/(start-jp)/login");
          }}>
          <LinearGradient
            colors={["#00A3FF", "#00FFC6"]}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 16,
              borderRadius: 12,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                backgroundColor: "transparent",
              }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                }}>
                次へ
              </Text>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "transparent",
                }}>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  style={{
                    color: "#FFFFFF",
                  }}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    height: 120,
    color: "#fff",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
