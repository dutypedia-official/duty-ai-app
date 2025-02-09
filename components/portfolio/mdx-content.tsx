import { View, Text, useColorScheme, Dimensions } from "react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { useThemeColor } from "@/components/Themed";
import { Paragraph } from "react-native-paper";

export default function MdxContent({
  data,
  expanded,
}: {
  data: any;
  expanded: any;
}) {
  const borderColor = useThemeColor({}, "border");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Markdown
      style={{
        body: {
          color: isDark ? "#B0B0B0" : "#004662",
          fontSize: 14,
        },
        // Headings
        heading1: {
          fontSize: 24,
          fontWeight: "bold",
          marginVertical: 10,
        },
        heading2: {
          fontSize: 22,
          fontWeight: "bold",
          marginVertical: 8,
        },
        heading3: {
          fontSize: 20,
          fontWeight: "bold",
          marginVertical: 6,
        },
        heading4: {
          fontSize: 18,
          fontWeight: "bold",
          marginVertical: 5,
        },
        heading5: {
          fontSize: 16,
          fontWeight: "bold",
          marginVertical: 4,
        },
        heading6: {
          fontSize: 14,
          fontWeight: "bold",
          marginVertical: 3,
        },
        // Lists
        bullet_list: { marginVertical: 5 },
        ordered_list: { marginVertical: 5 },
        list_item: { marginVertical: 3, flexDirection: "row" },
        bullet_list_icon: {
          marginRight: 5,
        },
        ordered_list_icon: {
          marginRight: 5,
        },
        // Code
        code_inline: {
          fontFamily: "monospace",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          paddingHorizontal: 4,
        },
        fence: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderRadius: 5,
          padding: 10,
          marginVertical: 5,
        },
        // Table
        table: {
          borderWidth: 1,
          borderColor: borderColor,
          marginVertical: 10,
        },
        tr: {
          borderBottomWidth: 1,
          borderColor: borderColor,
        },
        th: {
          fontWeight: "bold",
          padding: 5,
          borderRightWidth: 1,
          borderColor: borderColor,
        },
        td: {
          padding: 5,
          borderRightWidth: 1,
          borderColor: borderColor,
        },
        // Blockquote
        blockquote: {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderLeftWidth: 4,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 5,
        },
        // Horizontal rule
        hr: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          height: 1,
          marginVertical: 10,
        },
        paragraph: {
          lineHeight: 20,
        },
      }}>
      {expanded || !data?.summary
        ? `${data?.summary} **...Read Less**`
        : `${data?.summary.substring(0, 186)} **Read More...**`}
    </Markdown>
  );
}
