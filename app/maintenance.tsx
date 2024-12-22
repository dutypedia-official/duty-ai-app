import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import Markdown from "react-native-markdown-display";
import { SvgXml } from "react-native-svg";

export default function Limit() {
  const insets = useSafeAreaInsets();
  const borderColor = useThemeColor({}, "border");
  const content = `# **Maintenance Underway**
We will notify you when we come back online`;
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
            <View
              style={{
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Markdown
                style={{
                  body: {
                    color: "#EAEAEA",
                    fontSize: 14,
                    margin: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    alignSelf: "center",
                  },
                  // Headings
                  heading1: {
                    color: "#BDD7FF",
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    alignItems: "center",
                    alignContent: "center",
                  },
                  heading2: {
                    fontSize: 22,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  heading3: {
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  heading4: {
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  heading5: {
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  heading6: {
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  // Lists
                  bullet_list: { marginVertical: 5 },
                  ordered_list: { marginVertical: 5 },
                  list_item: { marginVertical: 3, flexDirection: "row" },
                  bullet_list_icon: {
                    marginRight: 5,
                  },
                  ordered_list_icon: {
                    marginRight: 5,
                  },
                  // Code
                  code_inline: {
                    fontFamily: "monospace",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderRadius: 3,
                    paddingHorizontal: 4,
                  },
                  fence: {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: 5,
                    padding: 10,
                  },
                  // Table
                  table: {
                    borderWidth: 1,
                    borderColor: borderColor,
                  },
                  tr: {
                    borderBottomWidth: 1,
                    borderColor: borderColor,
                  },
                  th: {
                    fontWeight: "bold",
                    padding: 5,
                    borderRightWidth: 1,
                    borderColor: borderColor,
                  },
                  td: {
                    padding: 5,
                    borderRightWidth: 1,
                    borderColor: borderColor,
                  },
                  // Blockquote
                  blockquote: {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderLeftWidth: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginVertical: 5,
                  },
                  // Horizontal rule
                  hr: {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    height: 1,
                    marginVertical: 10,
                  },
                }}>
                {content}
              </Markdown>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}>
              <SvgXml
                xml={round_bg}
                width={
                  Dimensions.get("window").width -
                  Dimensions.get("window").width / 3
                }
                height={
                  Dimensions.get("window").width -
                  Dimensions.get("window").width / 3
                }
                // preserveAspectRatio="xMidYMid slice"
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <View
                  style={{
                    width: "50%",
                    alignSelf: "center",
                    aspectRatio: 1 / 1,
                    alignItems: "center",
                    borderRadius: 1000,
                    padding: 20,
                    position: "relative",
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
                      source={require("@/assets/animations/maintenance.gif")} // Replace with your GIF path
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

const round_bg = `<svg width="182" height="182" viewBox="0 0 182 182" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.3" filter="url(#filter0_f_6995_54007)">
<path d="M157 91C157 127.451 127.451 157 91 157C54.5492 157 25 127.451 25 91C25 54.5492 54.5492 25 91 25C127.451 25 157 54.5492 157 91Z" fill="url(#paint0_radial_6995_54007)"/>
</g>
<defs>
<filter id="filter0_f_6995_54007" x="0" y="0" width="182" height="182" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="12.5" result="effect1_foregroundBlur_6995_54007"/>
</filter>
<radialGradient id="paint0_radial_6995_54007" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(91 91) rotate(90) scale(66)">
<stop stop-color="#484848" stop-opacity="0.6"/>
<stop offset="1" stop-color="#AEAEAE" stop-opacity="0.1"/>
</radialGradient>
</defs>
</svg>
`;
