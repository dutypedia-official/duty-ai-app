import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment, useRef } from "react";
import { SegmentedButtons, Text } from "react-native-paper";
import { SafeAreaView, View } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Ionicons } from "@expo/vector-icons";
import useMarket from "@/lib/hooks/useMarket";

export default function StartScreen() {
  const { setSelectMarket } = useMarket();
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const videoRef = useRef<any>(null);

  const languages = [
    {
      value: "Bn",
      label: "বাংলা",
    },
    {
      value: "Jp",
      label: "日本語",
    },
    {
      value: "En",
      label: "English",
    },
  ];

  const title = () => {
    if (language === "Jp") {
      return (
        <Fragment>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 56,
              color: "#fff",
              textShadowColor: "rgba(255, 255, 255, 0.34)",
              textShadowOffset: { width: 4, height: 2 },
              textShadowRadius: 8,
            }}>
            プロのよに
          </Text>
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
      );
    } else if (language === "Bn") {
      return (
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
            দিয়ে
          </Text>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 56,
              color: "#68A9FF",
              textShadowColor: "rgba(255, 255, 255, 0.34)",
              textShadowOffset: { width: 4, height: 2 },
              textShadowRadius: 8,
            }}>
            প্রফেশনাল
          </Text>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 56,
              color: "#68A9FF",
              textShadowColor: "rgba(255, 255, 255, 0.34)",
              textShadowOffset: { width: 4, height: 2 },
              textShadowRadius: 8,
              textAlign: "center",
            }}>
            শেয়ার{"\n"}বিশ্লেষণ
          </Text>
        </Fragment>
      );
    } else {
      return (
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
            stock
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
            Analysis
          </Text>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 56,
              color: "#68A9FF",
              textShadowColor: "rgba(255, 255, 255, 0.34)",
              textShadowOffset: { width: 4, height: 2 },
              textShadowRadius: 8,
            }}>
            Like a pro
          </Text>
        </Fragment>
      );
    }
  };

  const subTitle = () => {
    if (language === "Bn") {
      return "বাজার গবেষণা এখন অনেক সহজ";
    } else {
      return "Simplifying Market Data";
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}>
      <StatusBar style="light" />
      <Video
        ref={videoRef}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          backgroundColor: isDark ? "#06112D" : "#FFFFFF",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        source={require("../../assets/video/background.mp4")}
        shouldPlay={true}
        isLooping={false}
        //@ts-ignore
        resizeMode={"cover"}
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
              {title()}
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
                {subTitle()}
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
            language === "Jp"
              ? router.push("/(start-jp)/market")
              : router.push("/(start)/market");
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
                {language === "Bn" ? "পরবর্তী" : "Next"}
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
