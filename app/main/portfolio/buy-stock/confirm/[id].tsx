import { SafeAreaView } from "@/components/Themed";
import ConfirmBuyStock from "@/components/portfolio/confirmBuyStock";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
          gap: 25,
          position: "absolute",
          paddingTop: insets.top,
          zIndex: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "#1D4ED8" : "#2563EB",
            borderRadius: 50,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            width: 36,
            height: 36,
          }}>
          <Text>
            <Ionicons
              name={"chevron-back"}
              size={24}
              style={{ color: "#FFFFFF" }}
            />
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <ConfirmBuyStock />
      </ScrollView>
    </SafeAreaView>
  );
}
