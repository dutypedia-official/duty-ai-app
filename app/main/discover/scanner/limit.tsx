import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default function Limit() {
  const insets = useSafeAreaInsets();
  const [alertText, setAlertText] = useState<any>(
    `The Stock Screen feature is${"\n"}available only between${"\n"}10:00 AM and 2:00 PM.`
  );
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}>
      <LinearGradient
        colors={["#2A2B2A", "#484848"]}
        start={{ x: 0, y: 0 }} // Top
        end={{ x: 0, y: 1 }} // Bottom
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          position: "absolute",
          backgroundColor: "#484848",
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: "transparent",
          flex: 1,
          paddingHorizontal: 12,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}>
          <View
            style={{
              marginTop: "20%",
              gap: 16,
            }}>
            <View>
              <Text
                style={{
                  color: "#EAEAEA",
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                  lineHeight: 32,
                }}>
                {alertText}
              </Text>
            </View>
            <View
              style={{
                width: "40%",
                alignSelf: "center",
                aspectRatio: 500 / 500,
                alignItems: "center",
              }}>
              {/* <LottieView
                style={{ flex: 1 }}
                source={require("@/assets/animations/sleep.json")}
                autoPlay
                loop
              /> */}

              <View
                style={{
                  width: "100%",
                  height: "100%",
                  // iOS Shadows
                  shadowColor: "rgba(0, 0, 0, 0.25)",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 20,
                  // Android Shadows
                  elevation: 8,
                  borderRadius: 100,
                }}>
                <Image
                  source={require("@/assets/animations/sleep.gif")} // Replace with your GIF path
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 8, // Match the borderRadius of the wrapper for consistent styling
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <LinearGradient
                colors={["#6A5ACD", "#836FFF"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: Dimensions.get("window").width - 24,
                  height: 48,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderRadius: 24,
                  alignContent: "center",
                  justifyContent: "center",
                  // iOS Shadows
                  shadowColor: "rgba(0, 0, 0, 0.20)",
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 12, // iOS shadow blur radius
                  elevation: 8, // Android shadow
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
                      fontSize: 16,
                      textAlign: "center",
                    }}>
                    Close
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
