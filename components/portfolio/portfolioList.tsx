import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { router } from "expo-router";
import useLang from "@/lib/hooks/useLang";

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

  const sellPrice = item.buyPrice - item.currentPrice;
  const isRisk = sellPrice < 0;

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${item?.symbol}.svg`;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/main/setting/sell-stock/[id]",
          params: {
            id: item?.symbol,
            isRisk: isRisk.toString(),
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
                {item?.symbol[0]}
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
              {item?.symbol}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: isDark ? "#6B7280" : "#6B7280",
                fontSize: 12,
                fontWeight: "medium",
              }}>
              {isBn ? "ক্রয় মূল্য" : "Buy price"} ৳{item?.buyPrice}
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
            ৳{item?.currentPrice} ({item?.change}%)
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
              {isRisk ? "-" : "+"}৳{Math.abs(sellPrice).toFixed(2)}
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
