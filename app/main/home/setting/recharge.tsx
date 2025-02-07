import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import RechargeCard from "@/components/notif/rechargeCard";

export default function Recharge() {
  const insets = useSafeAreaInsets();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const bgColor = useThemeColor({}, "background");

  const cards = [
    {
      id: "1",
      bonus: "5",
      coin: "10000",
      expiryDate: "3",
      amount: "100",
      isPopular: true,
    },
    {
      id: "12",
      bonus: "2",
      coin: "10000",
      expiryDate: "8",
      amount: "100",
      isPopular: false,
    },
    {
      id: "119",
      coin: "10000",
      expiryDate: "3",
      amount: "100",
      isPopular: false,
    },
    {
      id: "73",
      bonus: "5",
      coin: "10000",
      expiryDate: "3",
      amount: "100",
      isPopular: false,
    },
    {
      id: "82",
      bonus: "2",
      coin: "10000",
      expiryDate: "8",
      amount: "100",
      isPopular: false,
    },
    {
      id: "27",
      coin: "10000",
      expiryDate: "3",
      amount: "100",
      isPopular: false,
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}>
      <View
        style={{
          position: "absolute",
          zIndex: 999,
          paddingTop: insets.top + 10,
          backgroundColor: bgColor,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 10,
          paddingHorizontal: 12,
          gap: 25,
        }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "#fff" : "#6EA8D5",
            borderRadius: 50,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            width: 32,
            height: 32,
          }}>
          <Text>
            <Ionicons
              name="chevron-back"
              size={20}
              style={{ color: "#311919" }}
            />
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "semibold",
            textAlign: "center",
            color: isDark ? "#fff" : "#333333",
          }}>
          Recharge
        </Text>
        <View style={{ backgroundColor: "transparent", width: 36 }}></View>
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}>
        <View
          style={{
            flex: 1,
            marginTop: 50,
            backgroundColor: "transparent",
          }}>
          <FlashList
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            renderItem={({ item }) => <RechargeCard item={item} />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
