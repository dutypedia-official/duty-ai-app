import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { radialBg } from "../svgs/radialBg";
import { Audio } from "expo-av";
import { apiClientPortfolio } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import { playButtonSound } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import useUi from "@/lib/hooks/useUi";

export default function ResetPortfolioCard({ open, setOpen, setClose }: any) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const {
    setBalance,
    setFreeBalance,
    setTotalInvestment,
    setTotalCurrentMarketValue,
    setTotalBrokerFee,
    setRefreash,
    refreash,
  } = useUi();
  const { getToken } = useAuth();
  const isFocus = useIsFocused();
  const clientPortfolio = apiClientPortfolio();
  const [isLoading, setIsLoading] = useState(false);

  const resetFn = async (init: boolean = true) => {
    const sound = new Audio.Sound();
    try {
      setIsLoading(true);
      const token = await getToken();
      await clientPortfolio.post(`/portfolio/reset`, {}, token);
      setBalance("0");
      setFreeBalance("0");
      setTotalInvestment("0");
      setTotalCurrentMarketValue("0");
      setTotalBrokerFee("0");
      setRefreash(!refreash);
      setOpen(false);
      router.dismissTo("/main/portfolio/welcome-portfolio");
    } catch (error) {
      // Load the MP3 file
      await sound.loadAsync(require("@/assets/error.mp3")); // Replace with your MP3 path
      await sound.playAsync();
      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync(); // Clean up
          setIsLoading(false);
        }
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
            }}>
            <SvgXml
              xml={radialBg}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
              }}
            />

            <View
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 5,
                borderWidth: 1,
                borderColor: isDark ? "#3C3C47" : "#E0E0E0",
                margin: 12,
                borderRadius: 24,
                overflow: "hidden",
              }}>
              <LinearGradient
                colors={
                  isDark ? ["#2A2B36", "#1C1C28"] : ["#E6E6E6", "#F9F9F9"]
                }
                style={{
                  paddingVertical: 44,
                  paddingHorizontal: 12,
                  alignItems: "center",
                  gap: 40,
                }}>
                <View
                  style={{
                    gap: 16,
                    paddingHorizontal: 24,
                  }}>
                  <Text
                    style={{
                      color: isDark ? "#B0B0C3" : "#6B6B6B",
                      fontSize: 16,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}>
                    {isBn
                      ? "❗ আপনি কি নিশ্চিত যে আপনি আপনার পোর্টফোলিও রিসেট করতে চান?"
                      : "❗ Are you sure you want to reset your portfolio?"}
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#B5B5B5" : "#6B6B6B",
                      fontSize: 14,
                      textAlign: "center",
                      lineHeight: 24,
                    }}>
                    {isBn
                      ? "একবার রিসেট করলে আপনার সমস্ত পোর্টফোলিও ইতিহাস ও সমস্ত ট্রেড মুছে যাবে, এবং এটি আর ফিরে আসবে না।"
                      : "Once reset, your entire portfolio history and all trades will be deleted permanently, and it cannot be restored."}
                  </Text>
                </View>
                <View
                  style={{
                    gap: 13,
                    width: "100%",
                  }}></View>
                <LinearGradient
                  colors={
                    isDark ? ["#1C1C1C", "#242424"] : ["#E6E6E6", "#F9F9F9"]
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#3C3C47" : "#EBEBEB",
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound(require("@/assets/ipad_click.mp3"));
                        setOpen(false);
                        setClose(false);
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                      }}>
                      <View
                        style={{
                          shadowColor: "#FF4500",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }}>
                        <LinearGradient
                          colors={
                            isDark
                              ? ["#FF3A3A", "#FF5C5C"]
                              : ["#D84315", "#FF8A65"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            borderRadius: 8,
                            alignItems: "center",
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: isDark ? "#FFFFFF" : "#FFFFFF",
                            }}>
                            {isBn ? "বাতিল করুন" : "Cancel"}
                          </Text>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound(require("@/assets/ipad_click.mp3"));
                        resetFn();
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                      }}>
                      <View
                        style={{
                          shadowColor: isLoading ? "transparent" : "#42A5F5",
                          shadowOffset: {
                            width: 0,
                            height: 4,
                          },
                          shadowOpacity: 0.7,
                          shadowRadius: 6,
                          elevation: 4,
                        }}>
                        <LinearGradient
                          colors={
                            isLoading
                              ? isDark
                                ? ["#3C3C47", "#3C3C47"]
                                : ["#E0E0E0", "#E0E0E0"]
                              : isDark
                              ? ["#007BFF", "#1E90FF"]
                              : ["#1E88E5", "#42A5F5"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            borderRadius: 8,
                            alignItems: "center",
                          }}>
                          {isLoading ? (
                            <ActivityIndicator size={"small"} />
                          ) : (
                            <Text
                              style={{
                                fontSize: 14,
                                color: isDark ? "#FFFFFF" : "#FFFFFF",
                              }}>
                              {isBn ? "রিসেট করুন" : "Reset now"}
                            </Text>
                          )}
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
