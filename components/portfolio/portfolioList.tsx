import useLang from "@/lib/hooks/useLang";
import { formatFloat, isLossItem, playButtonSound } from "@/lib/utils";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SvgUri } from "react-native-svg";

export default function PortfolioList({
  isLast,
  item,
}: {
  isLast: any;
  item: any;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";

  const isRisk = isLossItem(item?.profit);

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${item?.stock?.symbol}.svg`;

  const formatPercentage = (value: number) => {
    const formatted = (value * 100).toFixed(2); // Convert to percentage and fix to 2 decimal places
    return `${formatted.startsWith("-") ? "" : "+"}${formatted}%`;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        playButtonSound(require("@/assets/ipad_click.mp3"));
        router.push({
          pathname: "/main/portfolio/sell-stock/[id]",
          params: {
            id: item?.id,
            stock: JSON.stringify(item),
          },
        });
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderColor: isDark ? "#202020" : "#F1F1F1",
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
              position: "relative",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <View
              style={{
                width: 28,
                height: 28,
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
                {item?.stock?.name[0]}
              </Text>
            </View>
            {logoUrl && <SvgUri uri={logoUrl} width={28} height={28} />}
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: isDark ? "#87CEEB" : "#004662",
              }}>
              {item?.stock?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: isDark ? "#6B7280" : "#6B7280",
                fontSize: 12,
                fontWeight: "medium",
              }}>
              {isBn ? "ক্রয় মূল্য" : "Buy price"} ৳{item?.avgCost}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}>
        <View
          style={{
            flex: 1,
            paddingRight: 6,
            justifyContent: "flex-end",
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: isDark ? "#919191" : "#919191",
              fontSize: 12,
              fontWeight: "medium",
              textAlign: "right",
            }}>
            ৳{item?.stock?.close} (
            {item?.stock?.change?.startsWith("-") ? "" : "+"}
            {formatFloat(item?.stock?.change)}%)
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
            }}>
            {isRisk ? (
              <FontAwesome5
                name="caret-down"
                size={24}
                color={isDark ? "#FF6347" : "#FF4500"}
              />
            ) : (
              <FontAwesome5 name="caret-up" size={24} color="#28A745" />
            )}
            <Text
              numberOfLines={1}
              style={{
                textAlign: "right",
                fontSize: 12,
                fontWeight: "medium",
                color: isRisk
                  ? isDark
                    ? "#FF6347"
                    : "#FF4500"
                  : isDark
                  ? "#28A745"
                  : "#28A745",
              }}>
              {isRisk ? (isBn ? "লস" : "Loss") : isBn ? "লাভ" : "Profit"}{" "}
              {isRisk ? "-" : "+"}৳{formatFloat(Math.abs(item?.profit))}
            </Text>
          </View>
        </View>
        <View>
          <FontAwesome
            name="angle-right"
            size={24}
            color={isDark ? "white" : "#1C7ED6"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
