import {
  View,
  Text,
  useColorScheme,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useThemeColor } from "../Themed";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import useVipSignal from "@/lib/hooks/useVipSignal";
import useChat from "@/lib/hooks/useChat";
import { FontAwesome6 } from "@expo/vector-icons";

const VipSignal = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const { selectStock, clearSelectStock, answer, setAnswer } = useVipSignal();
  const { setTemplate } = useChat();

  const vipSignals = [
    {
      icon: (
        <FontAwesome6
          name="magnifying-glass-chart"
          size={18}
          color="#FFD700"
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignContent: "center",
            margin: "auto",
          }}
        />
      ),
      bgColor: isDark ? ["#333333", "#0F0F0F"] : ["#FFD700", "#FFD700"],
      title: "Stock Screener",
      subTitle: "Find Top Stocks with Duty AI",
      action: () => {
        setTemplate("scanner");
        router.push("/main/discover/scanner/");
      },
    },
    {
      icon: (
        <FontAwesome
          name="balance-scale"
          size={16}
          color="#FFD700"
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignContent: "center",
            margin: "auto",
          }}
        />
      ),
      bgColor: isDark ? ["#222831", "#0F0F0F"] : ["#91C6F0", "#F0F2F5"],
      title: "Golden Choice",
      subTitle: "Find Your Golden Stock with AI",
      action: () => {
        if (selectStock.length > 0) {
          clearSelectStock();
        }
        // if (answer) {
        //   setAnswer(null);
        // }
        router.push("/main/discover/vipsignal/list/");
      },
    },
  ];

  return (
    <View
      style={{
        paddingHorizontal: 12,
        backgroundColor: bgColor,
      }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
          alignItems: "center",
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#FFD700" : "#8B7500",
          }}>
          Exclusive 👑
          {/* Vip <Foundation name="crown" size={24} color="black" /> */}
        </Text>
      </View>
      <View style={{ gap: 20 }}>
        {vipSignals?.map((item, i) => {
          return (
            <TouchableOpacity key={i} onPress={item?.action}>
              <LinearGradient
                style={{
                  borderRadius: 12,
                  padding: 12,
                  paddingVertical: 20,
                }}
                colors={item?.bgColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignContent: "center",
                      backgroundColor: "#000000",
                    }}>
                    {item.icon}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <View style={{ gap: 4 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: isDark ? "#FFD700" : "#8B7500",
                          fontWeight: "bold",
                        }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: isDark ? "#FFFFFF" : "#757575",
                          fontWeight: "normal",
                        }}>
                        {item.subTitle}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                      }}>
                      {/* <Text
                        style={{
                          fontSize: 14,
                          color: isDark ? "#FFFFFF" : "#757575",
                          fontWeight: "normal",
                        }}>
                        Demo 🚀
                      </Text> */}
                      <Entypo
                        name="chevron-right"
                        size={24}
                        color={isDark ? "#FFFFFF" : "#000000"}
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default VipSignal;
