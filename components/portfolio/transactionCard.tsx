import {
  View,
  Text,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function TransactionCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
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
    },
    {
      tabName: "Losses",
    },
    {
      tabName: "Withdraw",
    },
    {
      tabName: "Deposit",
    },
  ];

  return (
    <View>
      <View
        style={{
          marginHorizontal: 12,
          gap: 16,
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: isDark ? "#FFFFFF" : "#1A202C",
            }}>
            All transaction history
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}>
            <Text
              style={{
                color: isDark ? "#FFFFFF" : "#1A202C",
              }}>
              See all
            </Text>
            <FontAwesome name="angle-right" size={14} color={"#4A5568"} />
          </View>
        </View>
        <View
          style={{
            backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
            padding: 12,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: isDark ? "#262626" : "#E0E0E0",
            overflow: "hidden",
          }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "#262626" : "#F0F2F5",
              padding: 4,
              borderRadius: 8,
            }}>
            {tabs?.map((item, i) => {
              const active = i === activeTabIndex;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleTabPress(i)}
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
          <Animated.View
            style={[
              {
                width: Dimensions.get("screen").width * 3,
                flexDirection: "row",
                paddingLeft: 12,
              },
              animatedStyle,
            ]}>
            {tabs?.map((tabData, i) => {
              return (
                <View
                  key={i}
                  style={{
                    width: Dimensions.get("screen").width,
                    gap: 24,
                  }}>
                  <Text>lorem</Text>
                  {/* {tabData?.data?.map((item, id) => {
                          return <TabContentArea key={id} item={item} />;
                        })} */}
                </View>
              );
            })}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
