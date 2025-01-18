import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "../Themed";
import { LinearGradient } from "expo-linear-gradient";

export default function AssetsBal() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const logoUrl = `https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg`;

  return (
    <SafeAreaView>
      <View
        style={{
          gap: 24,
        }}>
        <View
          style={{
            marginHorizontal: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: isDark ? "#1E1E1E" : "#F5F5F5",
            borderRadius: 20,
            backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <View>
            <View
              style={{
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
              }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  overflow: "hidden",
                  backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                  position: "relative",
                }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 12,
                      color: "#1E1E1E",
                    }}>
                    A
                  </Text>
                </View>

                {logoUrl && (
                  <Image source={{ uri: logoUrl }} width={36} height={36} />
                )}
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                  flexShrink: 1,
                  justifyContent: "space-between",
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#fff" : "#777777",
                  }}
                  numberOfLines={1}>
                  Hello
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: isDark ? "#87CEEB" : "#000000",
                  }}
                  numberOfLines={1}>
                  Salma Akater salma ...
                </Text>
              </View>
            </View>
            <View
              style={{
                margin: "auto",
                gap: 8,
                paddingVertical: 24,
              }}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#6388",
                  fontSize: 12,
                }}>
                Total Equity
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: 24,
                }}>
                t19000.98
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "#237",
                  fontWeight: "semibold",
                  fontSize: 12,
                }}>
                +73465.23
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#444",
                padding: 12,
                borderRadius: 12,
                gap: 16,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <View>
                  <Text
                    style={{
                      color: "#fff",
                    }}>
                    Trading Balance
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#fff",
                    }}>
                    t3435345890.99
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                  }}>
                  <LinearGradient
                    colors={
                      !isDark ? ["#4CAF50", "#4CAF50"] : ["#800055", "#800055"]
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
                      Deposit
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                  }}>
                  <LinearGradient
                    colors={
                      !isDark ? ["#4CAF50", "#4CAF50"] : ["#800055", "#800055"]
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
                      Withdraw
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
