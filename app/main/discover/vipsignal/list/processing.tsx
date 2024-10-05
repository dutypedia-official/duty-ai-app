import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import useVipSignal from "@/lib/hooks/useVipSignal";
import LottieView from "lottie-react-native";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { apiClient } from "@/lib/api";
import { useAuth } from "@clerk/clerk-expo";
import useUi from "@/lib/hooks/useUi";

export const ProcessingDataList = ({ index, item }: any) => {
  const { selectStock, setSelectStock } = useVipSignal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");

  return (
    <View key={index}>
      <LinearGradient
        style={{
          borderRadius: 8,
          padding: 1,
        }}
        colors={
          !item?.isCompleted && !item?.isProcessing
            ? ["#91C6F0", "#F0F2F5"]
            : ["#FFD700", "#F0F2F5"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <LinearGradient
          style={{
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          colors={
            !item?.isCompleted && !item?.isProcessing
              ? [bgColor, bgColor]
              : item?.isCompleted && isDark
              ? ["#333333", "#0F0F0F"]
              : isDark
              ? ["#121212", "#000000"]
              : ["#FFD700", "#F0F2F5"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text
            style={{
              color:
                !item?.isCompleted && !item?.isProcessing
                  ? isDark
                    ? "#FFFFFF"
                    : "#91C6F0"
                  : isDark
                  ? "#FFD700"
                  : "#8B7500",
              fontSize: 14,
              width: "85%",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectStock.some((data) => item.label === data) && "Collecting"}{" "}
            {item.label}{" "}
            {selectStock.some((data) => item.label === data) && "Data"}
          </Text>

          {/* Display check icon if completed */}
          {item.isCompleted && (
            <LinearGradient
              colors={isDark ? ["#FFD700", "#F0F2F5"] : ["#91C6F0", "#F0F2F5"]}
              style={{
                width: 20,
                height: 20,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="check" size={16} color="#121212" />
            </LinearGradient>
          )}
        </LinearGradient>
      </LinearGradient>

      {item.isProcessing && (
        <View
          style={{
            flex: 1,
            width: "80%",
            alignSelf: "center",
            aspectRatio: 16 / 9,
          }}
        >
          {!item?.label.includes("Analysis fundamental") &&
            !item?.label.includes("Analysis technical") &&
            !item?.label.includes("Our Algorithm") && (
              <LottieView
                style={{ flex: 1 }}
                source={
                  index === 1
                    ? require("@/assets/animations/handoff.json")
                    : require("@/assets/animations/collecting.json")
                }
                autoPlay
                loop
              />
            )}
          {item?.label.includes("Analysis fundamental") && (
            <LottieView
              style={{ flex: 1 }}
              source={require("@/assets/animations/optimize.json")}
              autoPlay
              loop
            />
          )}
          {item?.label.includes("Analysis technical") && (
            <LottieView
              style={{ flex: 1 }}
              source={require("@/assets/animations/search.json")}
              autoPlay
              loop
            />
          )}
          {item?.label.includes("Our Algorithm") && (
            <LottieView
              style={{ flex: 1 }}
              source={require("@/assets/animations/search.json")}
              autoPlay
              loop
            />
          )}
        </View>
      )}
    </View>
  );
};

const Processing = () => {
  const { selectStock, clearSelectStock, answer, setAnswer } = useVipSignal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const { mainServerAvailable } = useUi();

  const fetchData = async () => {
    try {
      const token = await getToken();
      const client = apiClient();
      const { data } = await client.post(
        "/chat/compare",
        {
          symbols: selectStock,
        },
        token,
        {},
        mainServerAvailable
      );

      setAnswer(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [processStep, setProcessStep] = useState([
    ...selectStock.map((stock) => ({
      label: stock,
      isProcessing: false,
      isCompleted: false,
      isLast: false,
    })),
    {
      label: "Analysis fundamental",
      isProcessing: false,
      isCompleted: false,
      isLast: false,
    },
    {
      label: "Analysis technical",
      isProcessing: false,
      isCompleted: false,
      isLast: false,
    },
    {
      label: "Our Algorithm",
      isProcessing: false,
      isCompleted: false,
      isLast: true,
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (answer) {
      router.push("/main/discover/vipsignal/list/win");
    }
  }, [answer]);

  useEffect(() => {
    let isCancelled = false; // To prevent updates after unmount

    // Function to update the processing steps sequentially
    const updateStepsSequentially = (index = 0) => {
      if (index >= processStep.length || isCancelled) return; // Stop if no more steps or cancelled

      // Set the current step to processing
      setProcessStep((prevSteps) =>
        prevSteps.map((step, i) => {
          if (i === index) {
            return { ...step, isProcessing: step.isLast ? false : true };
          }
          return step;
        })
      );

      setTimeout(() => {
        if (isCancelled) return; // Prevent state updates after unmount
        setProcessStep((prevSteps) =>
          prevSteps.map((step, i) => {
            if (i === index) {
              return {
                ...step,
                isProcessing: step.isLast ? true : false,
                isCompleted: step.isLast ? false : true,
              };
            }
            return step;
          })
        );

        // Check if this is the last step and it's completed
        if (index + 1 >= processStep.length) {
          // router.push("/main/discover/vipsignal/list/win");
        } else {
          updateStepsSequentially(index + 1); // Continue to the next step
        }
      }, 4000);
    };

    updateStepsSequentially();

    // Cleanup function to avoid memory leaks
    return () => {
      isCancelled = true;
    };
  }, [processStep.length, router]); // Include router in dependency array

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            color: isDark ? "#FFD700" : "#8B7500",
          }}
        >
          Processing
        </Text>
      </View>
      <View style={{ paddingTop: 20, flex: 1 }}>
        <StatusBar translucent={true} backgroundColor="transparent" />
        <View
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: 10,
            flex: 1,
          }}
        >
          <FlatList
            data={processStep}
            renderItem={({ item, index }: any) => (
              <ProcessingDataList index={index} item={item} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            height: 82,
            width: Dimensions.get("window").width,
            position: "relative",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              clearSelectStock();
              router.back();
            }}
            style={{
              shadowColor: "#9B9B9B",
              shadowOffset: {
                width: 0,
                height: 0.5,
              },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <LinearGradient
              colors={["#F6B253", "#FF9500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 1,
                borderRadius: 100,
              }}
            >
              <LinearGradient
                colors={["#F6B253", "#FF9500"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 100 }}
              >
                <Text
                  style={{
                    opacity: 0.7,
                    color: isDark ? "white" : "#FFFFFF",
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 12,
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Processing;
