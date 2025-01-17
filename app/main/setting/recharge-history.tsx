import { setting_bg_light } from "@/assets/icons/setting_bg_light";
import HistoryCard from "@/components/notif/historyCard";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

export default function RechargeHistory() {
  const insets = useSafeAreaInsets();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const bgColor = useThemeColor({}, "background");

  const transaction = [
    {
      id: "21",
      coin: "50000",
      status: "500 bdt",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "82",
      coin: "50000",
      status: "bonus",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "24",
      coin: "50000",
      status: "Coupon applied",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "211",
      coin: "50000",
      status: "500 bdt",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "3482",
      coin: "50000",
      status: "bonus",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "924",
      coin: "50000",
      status: "Coupon applied",
      createdAt: "2024-08-08T11:21:11.053000Z",
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
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          zIndex: 1000,
        }}>
        <Image
          source={require("@/assets/images/setting_bg_light.png")}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>

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
          Recharge History
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
            data={transaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            renderItem={({ item }) => <HistoryCard item={item} />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
