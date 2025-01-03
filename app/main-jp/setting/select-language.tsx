import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView, View, useThemeColor } from "@/components/Themed";
import { Button, Divider, Text } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import useLang from "@/lib/hooks/useLang";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import useMarket from "@/lib/hooks/useMarket";

export default function LanguageScreen() {
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const { selectMarket } = useMarket();
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";

  const path = usePathname();

  console.log("path---------", path);

  const filterLanguages = () => {
    if (selectMarket === "Bangladesh") {
      return [
        {
          name: "বাংলা",
          value: "Bn",
          action: () => {
            setLanguage("Bn");
            router.back();
          },
        },
        {
          name: "English",
          value: "En",
          action: () => {
            setLanguage("En");
            router.back();
          },
        },
      ];
    } else {
      return [
        {
          name: "English",
          value: "En",
          action: () => {
            setLanguage("En");
            router.back();
          },
        },
        {
          name: "Japanese",
          value: "Jp",
          action: () => {
            setLanguage("Jp");
            router.back();
          },
        },
      ];
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: bgColor,
      }}>
      <SafeAreaView style={styles.container}>
        <View>
          {filterLanguages().map((item, i) => (
            <TouchableOpacity onPress={item.action} key={i}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flex: 1,
                  }}>
                  <Text numberOfLines={1}>{item.name}</Text>
                </View>
                <View>
                  {language === item?.value && (
                    <Ionicons name="checkmark" size={24} color={"#14C396"} />
                  )}
                </View>
              </View>
              <Divider />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
