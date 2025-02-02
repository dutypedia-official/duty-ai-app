import {
  View,
  Text,
  Dimensions,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "@/components/Themed";
import useLang from "@/lib/hooks/useLang";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Audio } from "expo-av";

const schema = z.object({
  selectedOption: z
    .string({
      required_error: "Option must be selected",
    })
    .min(1, {
      message: "Please select an option",
    }), // Ensure a valid option is selected
});

export default function FeedbackScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<any>();
  const [selected, setSelected] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {},
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedOption: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSelect = async (item: any, onChange: any) => {
    const sound = new Audio.Sound();
    try {
      setSelected(item?.label), onChange(item?.label);
      // Load the MP3 file
      await sound.loadAsync(require("@/assets/click-menu-app.mp3")); // Replace with your MP3 path
      await sound.playAsync();

      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync(); // Clean up
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      console.log("Form submitted:", data);
      router.dismissTo("/thanks");
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const data = [
    {
      label: "স্টক এনালাইসিস চ্যাট",
    },
    {
      label: "স্টক স্ক্যানার",
    },
    {
      label: "গোল্ডেন চয়েস",
    },
    {
      label: "নোটিফিকেশন",
    },
  ];

  useEffect(() => {
    setQuestion(`ডিউটি এ আই এপে কোন ফিচার আপনার সব থেকে ভাল লাগে`);
    setOptions(data);
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <LinearGradient
        colors={isDark ? ["#0F0F0F", "#1A1A1A"] : ["#F0F2F5", "#F0F2F5"]}
        start={{ x: 0, y: 0 }} // Top
        end={{ x: 0, y: 1 }} // Bottom
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          position: "absolute",
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: "transparent",
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              alignItems: "flex-end",
              paddingHorizontal: 12,
              marginTop: 18,
            }}>
            <TouchableOpacity
              onPress={() => {
                router.dismissTo("/main/home");
              }}>
              <AntDesign
                name="close"
                size={32}
                color={isDark ? "#fff" : "#000000"}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 12,
              gap: 24,
              marginTop: 44,
            }}>
            <View
              style={{
                alignItems: "flex-start",
              }}>
              <LinearGradient
                colors={
                  isDark ? ["#1A1C2D", "#1A1C2D"] : ["#F6F6F6", "#F6F6F6"]
                }
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 0,
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(47,49,71,0.15)"
                    : "rgba(47,49,71,0.15)",
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#FFFFFF" : "#454545",
                    fontWeight: "semibold",
                  }}>
                  {isBn ? "আপনার মতামত জানান" : "Share Your Feedback"}
                </Text>
              </LinearGradient>
            </View>

            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: isDark ? "#EDEAFF" : "#1A1A1A",
                }}>
                {question}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "medium",
                  fontSize: 14,
                  color: isDark ? "#B3B1C7" : "#454545",
                }}>
                {isBn
                  ? "নিচে থেকে একটি অপশন পছন্দ করে আপনার মতামত দিন "
                  : "Select an option below and share your feedback"}
              </Text>
            </View>
            <View
              style={{
                gap: 16,
              }}>
              <Controller
                control={control}
                name="selectedOption"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) =>
                  options?.map((item: any, index: number) => {
                    const active = item.label === selected;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(item, onChange)}>
                        <LinearGradient
                          colors={
                            active
                              ? isDark
                                ? ["#3A2680", "#3A2680"]
                                : ["#5A27FF", "#5A27FF"]
                              : isDark
                              ? ["#1A1C2D", "#1A1C2D"]
                              : ["#F6F6F6", "#F6F6F6"]
                          }
                          start={{
                            x: 0,
                            y: 0,
                          }}
                          end={{
                            x: 1,
                            y: 0,
                          }}
                          style={{
                            flexDirection: "row",
                            gap: 12,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: active
                              ? isDark
                                ? "rgba(122,85,255,0.15)"
                                : "#7A55FF"
                              : isDark
                              ? "#23263B"
                              : "#E0E0E0",
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            shadowColor: active ? "#6B47FF" : "transparent",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: active ? 0.2 : 0,
                            shadowRadius: active ? 5 : 0,
                            elevation: active ? 5 : 0,
                          }}>
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderWidth: 2,
                              borderColor: active
                                ? isDark
                                  ? "#5A27FF"
                                  : "#5A27FF"
                                : isDark
                                ? "#1F2335"
                                : "#C0C0C0",
                              backgroundColor: active
                                ? isDark
                                  ? "#4B00FF"
                                  : "#7A55FF"
                                : isDark
                                ? "#374151"
                                : "#fff",
                              borderRadius: 999,
                            }}></View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: active
                                ? isDark
                                  ? "#FFFFFF"
                                  : "#FFFFFF"
                                : isDark
                                ? "#FFFFFF"
                                : "#454545",
                              fontWeight: "semibold",
                            }}>
                            {item?.label}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })
                }
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
            }}>
            <TouchableOpacity
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              style={{
                width: "100%",
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: isDark ? 4 : 0 },
                shadowOpacity: isDark ? 0.25 : 0,
                shadowRadius: isDark ? 4 : 0,
                elevation: isDark ? 4 : 0,
                marginTop: 24,
                marginBottom: 32,
              }}>
              <LinearGradient
                colors={
                  isFormValid
                    ? isDark
                      ? ["#4B00FF", "#4B00FF"]
                      : ["#5A27FF", "#5A27FF"]
                    : isDark
                    ? ["#1A1C2D", "#1A1C2D"]
                    : ["#7A55FF", "#7A55FF"]
                }
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 0,
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 12,
                  borderWidth: isDark ? 0 : 1,
                  borderColor: "#23263B",
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: "bold",
                    }}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : isBn ? (
                      "আপনার মতামত দিন"
                    ) : (
                      "Share Your Opinion"
                    )}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
