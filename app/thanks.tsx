import {
  View,
  Text,
  ScrollView,
  Dimensions,
  useColorScheme,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import useLang from "@/lib/hooks/useLang";
import { router } from "expo-router";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";

export default function Thanks() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";

  const redirect = async () => {
    const sound = new Audio.Sound();
    try {
      // Load the MP3 file
      await sound.loadAsync(require("@/assets/success.mp3")); // Replace with your MP3 path
      await sound.playAsync();

      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync(); // Clean up
          router.dismissTo("/main/home");
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    redirect();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <LinearGradient
        colors={isDark ? ["#0F0F0F", "#1A1A1A"] : ["#F0F2F5", "#F0F2F5"]}
        start={{ x: 0, y: 0 }} // Top
        end={{ x: 0, y: 1 }} // Bottom
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          position: "absolute",
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: "transparent",
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              gap: 32,
            }}>
            <View>
              <View
                style={{
                  height: 84,
                  width: 84,
                  aspectRatio: 1 / 1,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }}>
                <LottieView
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                  source={
                    isDark
                      ? require("@/assets/animations/thankyouDark.json")
                      : require("@/assets/animations/thankyouLight.json")
                  }
                  autoPlay
                  loop={false}
                />
                {/* <LottieView
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                  source={
                    isDark
                      ? require("@/assets/animations/thankyouDark.json")
                      : require("@/assets/animations/thankyouLight.json")
                  }
                  autoPlay
                  loop={false}
                /> */}
                {/* <Image
                  source={
                    isDark
                      ? require("@/assets/animations/thankyouDark.gif")
                      : require("@/assets/animations/thankyouLight.gif")
                  } // Replace with your GIF path
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 8, // Match the borderRadius of the wrapper for consistent styling
                    resizeMode: "contain",
                  }}
                /> */}
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 28,
                  color: "#97A6FF",
                  textAlign: "center",
                }}>
                {isBn ? "আপনাকে ধন্যবাদ" : "Thank You"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
