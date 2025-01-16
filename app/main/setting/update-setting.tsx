import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { setting_bg_light } from "@/assets/icons/setting_bg_light";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { globe } from "@/assets/icons/globe";

export default function UpdateSetting() {
  const insets = useSafeAreaInsets();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const bgColor = useThemeColor({}, "background");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
      }}>
      <SvgXml xml={setting_bg_light} preserveAspectRatio="xMidYMid slice" />

      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <SvgXml xml={globe} />
      </SafeAreaView>
    </View>
  );
}
