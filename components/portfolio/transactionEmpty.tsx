import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { notfoundTransaction } from "../svgs/notfoundTransaction";

export default function TransactionEmpty({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        gap: 14,
        paddingVertical: 24,
      }}>
      <View>
        <SvgXml xml={notfoundTransaction} width={"100%"} />
      </View>
      <View
        style={{
          width: 240,
          paddingHorizontal: 6,
          margin: "auto",
        }}>
        <Text
          style={{
            color: isDark ? "#fff" : "#34343F",
            fontSize: 16,
            fontWeight: "medium",
            textAlign: "center",
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          width: 240,
          paddingHorizontal: 6,
          margin: "auto",
        }}>
        <Text
          style={{
            color: isDark ? "#B0B0B0" : "#464665",
            fontSize: 14,
            fontWeight: "medium",
            textAlign: "center",
          }}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
}
