import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { format, parseISO } from "date-fns";

export default function HistoryCard({ item }: { item: any }) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#2A2A2A" : "#CACACA",
        paddingVertical: 12,
        marginHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <View
        style={{
          width: "33.33%",
        }}>
        <Text
          style={{
            color: isDark ? "#FFFFFF" : "#333333",
          }}>
          {item?.coin}
        </Text>
      </View>
      <View
        style={{
          width: "33.33%",
        }}>
        <Text
          style={{
            color: isDark ? "#FFFFFF" : "#333333",
          }}>
          {item?.status}
        </Text>
      </View>
      <View
        style={{
          width: "33.33%",
        }}>
        <Text
          style={{
            color: isDark ? "#FFFFFF" : "#333333",
          }}>
          {format(parseISO(item?.createdAt), "yyyy/MM/dd")}
        </Text>
      </View>
    </View>
  );
}
