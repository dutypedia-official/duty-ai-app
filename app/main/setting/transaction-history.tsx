import TransactionTabContent from "@/components/portfolio/transactionTabContent";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  const profit = [
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

  const losses = [
    {
      id: "lk7yu34y74re",
      symbol: "GP",
      amount: "786542",
    },
    {
      id: "lk7yu34y74re",
      symbol: "DFAK",
      amount: "786542",
    },
    {
      id: "89k7yu34y74re",
      symbol: "THDTU",
      amount: "786542",
    },
  ];

  const withdraw = [
    {
      id: "lk7yu34y74re",
      amount: "78656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "lk7yu34y74re",
      amount: "78656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "6k7yu34y74re",
      amount: "78656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
  ];

  const deposit = [
    {
      id: "lk7yu34y74re",
      amount: "78656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "l9i7yu34y74re",
      amount: "988656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
    {
      id: "lk7yu34y74re",
      amount: "78656",
      createdAt: "2024-08-08T11:21:11.053000Z",
    },
  ];

  let data: {
    id: string;
    symbol?: string;
    amount: string;
    createdAt?: string;
  }[] = [];

  if (activeTab === "profit") data = profit;
  else if (activeTab === "losses") data = losses;
  else if (activeTab === "withdraw")
    data = withdraw.map((item) => ({ ...item, symbol: undefined }));
  else if (activeTab === "deposit")
    data = deposit.map((item) => ({ ...item, symbol: undefined }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? bgColor : "#fff",
      }}>
      <StatusBar backgroundColor={isDark ? "#171B26" : "#FFFFFF"} />
      <View
        style={{
          position: "absolute",
          zIndex: 999,
          paddingTop: insets.top + 24,
          paddingBottom: 24,
          backgroundColor: isDark ? bgColor : "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark ? bgColor : "#fff",
        }}>
        <FlatList
          contentContainerStyle={{
            marginTop: 84,
            paddingHorizontal: 12,
            paddingTop: 12,
            backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
            borderRadius: 16,
          }}
          data={data}
          keyExtractor={(item) => item?.id}
          ListHeaderComponent={() => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: isDark ? "#262626" : "#F0F2F5",
                  padding: 4,
                  borderRadius: 8,
                  marginHorizontal: "auto",
                  width: "100%",
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
                        width: (Dimensions.get("window").width - 32) / 4,
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
            );
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{}}>
                <TransactionTabContent
                  activeTab={activeTab}
                  isLast={index === data.length - 1}
                  item={item}
                />
              </View>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}
