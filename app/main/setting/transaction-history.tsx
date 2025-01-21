import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "@/components/Themed";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TransactionTabContent from "@/components/portfolio/transactionTabContent";
import { FlashList } from "@shopify/flash-list";

export default function TransactionHistory() {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");

  const [activeTab, setActiveTab] = useState("profit");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const translateX = useSharedValue(0);

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    translateX.value = withTiming(index * Dimensions.get("window").width, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -translateX.value }],
  }));

  const tabs = [
    {
      tabName: "Profit",
      value: "profit",
    },
    {
      tabName: "Losses",
      value: "losses",
    },
    {
      tabName: "Withdraw",
      value: "withdraw",
    },
    {
      tabName: "Deposit",
      value: "deposit",
    },
  ];

  const data = [
    {
      id: "lk7yu34y74re",
      symbol: "GP",
      amount: "966542",
    },
    {
      id: "lk7yu34y74re",
      symbol: "ROBI",
      amount: "966542",
    },
    {
      id: "34yu34y74re",
      symbol: "IFIC",
      amount: "966542",
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? bgColor : "#fff",
      }}>
      <View
        style={{
          position: "absolute",
          zIndex: 999,
          paddingTop: insets.top + 10,
          backgroundColor: isDark ? bgColor : "#fff",
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
            backgroundColor: "#FFFFFF",
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
            fontWeight: "bold",
            textAlign: "center",
            color: !isDark ? "#000" : "#fff",
          }}>
          All transaction history
        </Text>
        <View style={{ backgroundColor: "transparent", width: 32 }}></View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          height: "100%",
          flex: 1,
        }}>
        <StatusBar backgroundColor={isDark ? "#171B26" : "#FFFFFF"} />

        <View
          style={{
            height: "100%",
            marginTop: Platform.OS === "ios" ? insets.top : insets.top + 64,
          }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: isDark ? "#262626" : "#F0F2F5",
                padding: 4,
                borderRadius: 8,
                marginHorizontal: "auto",
              }}>
              {tabs?.map((item, i) => {
                const active = i === activeTabIndex;

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      handleTabPress(i);
                      setActiveTab(item?.value);
                    }}
                    style={{
                      backgroundColor: active
                        ? isDark
                          ? "#FFFFFF"
                          : "#FFFFFF"
                        : "transparent",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 4,
                      width: (Dimensions.get("window").width - 58) / 4,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontWeight: "medium",
                        color: active
                          ? isDark
                            ? "#000000"
                            : "#2D3748"
                          : isDark
                          ? "#718096"
                          : "#718096",
                      }}>
                      {item?.tabName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{}}>
              <FlashList
                data={data}
                estimatedItemSize={100}
                keyExtractor={(item) => item?.id}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        backgroundColor: "red",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                      }}>
                      {/* <TransactionTabContent
                      activeTab={activeTab}
                      isLast={2}
                      item={item}
                    /> */}
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
