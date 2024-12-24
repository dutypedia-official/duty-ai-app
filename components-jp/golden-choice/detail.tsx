import { SafeAreaView, Text, useThemeColor } from "@/components-jp/Themed";
import { apiClient } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { ActivityIndicator } from "react-native-paper";

export default function Details() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const params = useLocalSearchParams();
  const data = JSON.parse(`${params?.data}`);
  const borderColor = useThemeColor({}, "border");

  console.log(data?.details?.technical_analysis);

  if (!data) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
        }}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#FFFFFF" : "#171B26"}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: bgColor,
        flex: 1,
      }}>
      <StatusBar backgroundColor={bgColor} />
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
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
            backgroundColor: isDark ? "#000" : "#FFFFFF",
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
              name="chevron-back"
              size={24}
              style={{ color: isDark ? "#FFFFFF" : "#000" }}
            />
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            color: isDark ? "#FFFFFF" : "#8B7500",
          }}>
          {data?.name}
        </Text>
        <View style={{ backgroundColor: "transparent", width: 36 }}></View>
      </View>
      <ScrollView>
        <View style={{ backgroundColor: "transparent", gap: 32 }}>
          <View style={{ backgroundColor: "transparent" }}>
            <View
              style={{
                gap: 16,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}>
              <View style={{ backgroundColor: "transparent" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: !isDark ? "#8B7500" : "#FFD700",
                  }}>
                  Score
                </Text>
                <Text style={{ fontWeight: "900", fontSize: 48 }}>
                  {data?.details?.score}
                </Text>
              </View>
              <View
                style={{ backgroundColor: "transparent", marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: !isDark ? "#8B7500" : "#FFD700",
                  }}>
                  Financial Performance
                </Text>
                {Object.keys(data?.details?.financial_performance).map(
                  (key) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderBottomWidth: 1,
                        borderColor: borderColor,
                        paddingVertical: 16,
                      }}>
                      <Text style={{ textTransform: "capitalize" }}>
                        {key.replace("_", " ")}
                      </Text>
                      <Text>{data?.details?.financial_performance[key]}</Text>
                    </View>
                  )
                )}
              </View>
              <View
                style={{ backgroundColor: "transparent", marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: !isDark ? "#8B7500" : "#FFD700",
                  }}>
                  Key Performance Metrics
                </Text>
                {Object.keys(data?.details?.key_performance_metrics).map(
                  (key) => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderBottomWidth: 1,
                        borderColor: borderColor,
                        paddingVertical: 16,
                      }}
                      key={key}>
                      <Text style={{ textTransform: "capitalize" }}>
                        {key.replace("_", " ")}
                      </Text>
                      <Text>{data?.details?.key_performance_metrics[key]}</Text>
                    </View>
                  )
                )}
              </View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Technical Analysis
              </Text>

              {typeof data?.details?.technical_analysis === "string" ? (
                <Text>{data?.details?.technical_analysis}</Text>
              ) : (
                Object.keys(data?.details?.technical_analysis).map((key) => (
                  <View key={key} style={{}}>
                    <Text style={{ textTransform: "capitalize" }}>
                      {key.replace("_", " ")}
                    </Text>
                    <Text>
                      {typeof data?.details?.technical_analysis[key] ===
                      "object"
                        ? JSON.stringify(data?.details?.technical_analysis[key])
                        : data?.details?.technical_analysis[key]}
                    </Text>
                  </View>
                ))
              )}

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Investment Analysis
              </Text>

              <Text>{data?.details?.investment_analysis}</Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Overview
              </Text>
              <Text>{data?.details?.overview}</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Fair Value
              </Text>
              <Text>{data?.details?.fair_value}</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Total Liabilities
              </Text>
              <Text>{data?.details?.total_liabilities}</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Overall Assessment
              </Text>
              <Text>{data?.details?.overall_assessment}</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: !isDark ? "#8B7500" : "#FFD700",
                }}>
                Valuation
              </Text>
              <Text>{data?.details?.valuation}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
