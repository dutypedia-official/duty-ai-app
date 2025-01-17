import { coin } from "@/assets/icons/coin";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { useThemeColor } from "../Themed";
import { LinearGradient } from "expo-linear-gradient";

export default function RechargeCard({ item }: { item: any }) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const bgColor = useThemeColor({}, "background");

  return (
    <View
      style={{
        marginBottom: item?.isPopular ? 40 : 5,
        marginTop: 5,
        paddingHorizontal: 12,
      }}>
      <View
        style={{
          borderWidth: 2,
          borderColor: isDark ? "#044956" : "#E0E0E0",
          backgroundColor: isDark ? "#002329" : "#fff",
          borderRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
          position: "relative",
          //   aspectRatio: 1024.35 / 429,
          overflow: "hidden",
        }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}>
          <Image
            source={require("@/assets/images/rechargeBg.png")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            gap: 12,
            // justifyContent: "space-between",
          }}>
          {item?.bonus && (
            <View
              style={{
                flexDirection: "row",
              }}>
              <View>
                <LinearGradient
                  colors={
                    isDark ? ["#4CAF50", "#4CAF50"] : ["#800055", "#800055"]
                  }
                  style={{
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#FFFFFF",
                      fontWeight: "semibold",
                    }}>
                    {item?.bonus}% Bonus
                  </Text>
                </LinearGradient>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#F39C12",
                fontSize: 30,
              }}>
              {item?.coin}
            </Text>
            <SvgXml xml={coin} width={29.61} height={30.92} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#9B9B9B" : "#333333",
                }}>
                Valid for 30 days
              </Text>
            </View>
            <View>
              <LinearGradient
                colors={["#CBF201", "#86A000", "#758C00"]}
                style={{
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 19,
                  paddingVertical: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FFFFFF",
                    fontWeight: "semibold",
                  }}>
                  Buy ৳ {item?.amount}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
      {item?.isPopular && (
        <View
          style={{
            left: 12 + 7,
            top: 12 + 16,
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: isDark ? "#800055" : "#FF99CC",
            borderRadius: 24,
            zIndex: -1,
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingBottom: 8,
            paddingLeft: 22.5,
          }}>
          <View
            style={{
              position: "relative",
              borderRadius: 24,
            }}>
            <View
              style={{
                position: "relative",
                borderRadius: 24,
                justifyContent: "flex-end",
              }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: 14,
                }}>
                Most popular
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
