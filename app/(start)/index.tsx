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
import { useRef } from "react";
import { SegmentedButtons, Text } from "react-native-paper";
import { View, SafeAreaView } from "@/components-jp/Themed";
import useLang from "../../lib/hooks/useLang";

export default function StartScreen() {
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
            title: "Start",
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
            style={{ alignItems: "center", backgroundColor: "transparent" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                paddingVertical: 30,
                height: 90,
                color: "#fff",
              }}>
              {language === "Jp"
                ? "言語を選択"
                : language === "Bn"
                ? "ভাষা নির্বাচন করুন"
                : "Select Language"}
            </Text>

            <View
              style={{
                backgroundColor: "transparent",
                gap: 12,
              }}>
              {languages?.map((item, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setLanguage(item?.value)}
                    style={{
                      width: Dimensions.get("window").width - 24,
                      backgroundColor: "transparent",
                    }}>
                    <LinearGradient
                      colors={
                        language === item?.value
                          ? ["#6A00F4", "#A4508B"]
                          : ["#1C1C1C", "#1C1C1C"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 16,
                        borderRadius: 12,
                        shadowColor: "#000000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 3,
                        borderWidth: 1,
                        borderColor:
                          language === item?.value ? "#6A00F4" : "#333333",
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
                          {item?.label}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => {
            if (language === "Jp") {
              router.push("/(start-jp)/instruct2");
            } else {
              router.push("/(start)/instruct2");
            }
          }}>
          <LinearGradient
            colors={["#FF6FD8", "#00FFC6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 2,
              borderRadius: 100,
              opacity: 1,
            }}>
            <LinearGradient
              colors={["#FF6FD8", "#973FCD", "#3813C2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ borderRadius: 100, opacity: 0.8 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingVertical: 16,
                  textAlign: "center",
                  color: "#FFD700",
                }}>
                {language === "Jp" ? "次" : isBn ? "পরবর্তী" : "Next"}
              </Text>
            </LinearGradient>
          </LinearGradient>
        </Pressable>
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
