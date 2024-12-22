import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { Link, router, Stack } from "expo-router";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useLang from "../../lib/hooks/useLang";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/Themed";
import { Video } from "expo-av";

export default function Ins2Screen() {
  const langStore = useLang();
  const { language } = langStore;
  const isBn = language === "Bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const videoRef = useRef<any>(null);

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
        source={require("../../assets/video/overview.mp4")}
        shouldPlay={true}
        isLooping={false}
        //@ts-ignore
        resizeMode={"cover"}
      />
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Instruction",
          }}
        />
        {/* <Image
          style={styles.bgImage}
          resizeMode="contain"
          source={require("../../assets/icons/logo.png")}
        /> */}

        <View
          style={{
            zIndex: 10,
            position: "absolute",
            width: "100%",
            bottom: 0,
            left: 0,
            backgroundColor: "transparent",
          }}>
          <View style={{ padding: 20 }}>
            <Pressable
              onPress={() =>
                language === "Jp"
                  ? router.push("/(start-jp)/login")
                  : router.push("/(start)/login")
              }>
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
                    {isBn ? "শুরু করুন" : "Get Started"}
                  </Text>
                </LinearGradient>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    resizeMode: "contain",
    position: "relative",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  bgImage: {
    height: 250,
    width: 250,
    position: "absolute",
    opacity: 0.1,
    bottom: "25%",
    alignSelf: "center",
  },
});
