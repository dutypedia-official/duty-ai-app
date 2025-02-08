import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import useLang from "@/lib/hooks/useLang";
import {
  calcBroFeeAmount,
  calcTotalWithFee,
  formatFloat,
  getRiskLevel,
  isHighRisk,
  isLossItem,
  playButtonSound,
} from "@/lib/utils";
import useUi from "@/lib/hooks/useUi";
import { Audio } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";

export default function PlacedOrderBuy() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { setRefreash, refreash } = useUi();
  const isFocused = useIsFocused();

  const playSound = async () => {
    const sound = new Audio.Sound();
    // Load the MP3 file
    await sound.loadAsync(require("@/assets/confirm.mp3")); // Replace with your MP3 path
    await sound.playAsync();
    // Wait for playback to finish
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync(); // Clean up
      }
    });
  };
  useEffect(() => {
    playSound();
    setRefreash(!refreash);
  }, [isFocused]);

  const stockDetail = JSON.parse(params?.stockDetail as string);

  const totalBuy = stockDetail?.buyPrice * stockDetail?.quantity;

  const data = [
    {
      name: isBn ? "ক্রয় মূল্য" : "Buy Price",
      value: `৳${formatFloat(stockDetail?.buyPrice)}`,
    },

    {
      name: isBn ? "পরিমাণ" : "Quantity ",
      value: stockDetail?.quantity,
    },

    {
      name: isBn ? "ব্রোকার ফি" : "Broker Fee",
      value: `৳${calcBroFeeAmount(stockDetail?.brokerFee, totalBuy)} (${
        stockDetail?.brokerFee
      }%)`,
    },
    {
      name: isBn ? "মোট ক্রয় পরিমাণ" : "Total Buy Amount",
      value: `৳${calcTotalWithFee(totalBuy, stockDetail?.brokerFee)}`,
    },
  ];

  const isRisk = isHighRisk(stockDetail?.aiRisk) === "true" ? true : false;

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${stockDetail?.symbol}.svg`;

  return (
    <View
      style={{
        paddingTop: 24,
        paddingHorizontal: 12,
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          // justifyContent: "space-between",
        }}>
        <View
          style={{
            gap: 24,
          }}>
          <LinearGradient
            colors={isDark ? ["#1A1A1A", "#1A1A1A"] : ["#F6F6F6", "#F6F6F6"]}
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#333333" : "#E0E0E0",
              borderRadius: 16,
              paddingTop: 24,
            }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 12,
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  overflow: "hidden",
                  backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                  position: "relative",
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                  borderWidth: 2,
                  borderColor: "#E0E0E0",
                }}>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
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
                    {stockDetail?.symbol[0]}
                  </Text>
                </View>
                {logoUrl && (
                  <SvgUri uri={logoUrl} width={"100%"} height={"100%"} />
                )}
              </View>
              <View
                style={{
                  gap: 4,
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#fff" : "#004662",
                    textAlign: "center",
                  }}>
                  {stockDetail?.symbol}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#B0B0B0" : "#004662",
                    textAlign: "center",
                    // fontStyle: "italic",
                  }}>
                  Trade Date{" "}
                  {format(new Date(stockDetail?.createdAt), "MMM dd, yyyy")}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
              }}>
              {data?.map((item, i) => {
                const even = i % 2 === 0;
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderTopWidth: 1,
                      borderColor: isDark ? "#333333" : "#E0E0E0",
                      backgroundColor: isDark
                        ? even
                          ? "#141414"
                          : "#1A1A1A"
                        : even
                        ? "#F6F6F6"
                        : "#FFFFFF",
                    }}>
                    <View
                      style={{
                        paddingVertical: 12,
                        paddingLeft: 12,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#454545",
                          textAlign: "left",
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 1,
                        height: "100%",
                        backgroundColor: isDark ? "#333333" : "#E0E0E0",
                      }}></View>
                    <View
                      style={{
                        paddingVertical: 12,
                        paddingRight: 12,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          color: isDark ? "#fff" : "#454545",
                          textAlign: "right",
                        }}>
                        {item?.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderColor: isDark ? "#333333" : "#E0E0E0",
                  backgroundColor: isDark ? "#141414" : "#F6F6F6",
                }}>
                <View
                  style={{
                    paddingVertical: 12,
                    paddingLeft: 12,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isRisk
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}>
                    {isBn ? "ঝুঁকি" : "Risk"}
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    height: "100%",
                    backgroundColor: isDark ? "#333333" : "#E0E0E0",
                  }}></View>
                <View
                  style={{
                    paddingVertical: 12,
                    paddingRight: 12,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isRisk
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}>
                    {formatFloat(stockDetail?.aiRisk)}%
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderColor: isDark ? "#333333" : "#E0E0E0",
                  backgroundColor: isRisk
                    ? isDark
                      ? "#4D0D0D"
                      : "#FFEBEE"
                    : isDark
                    ? "#004D40"
                    : "#E8F5E9",
                }}>
                <View
                  style={{
                    paddingVertical: 12,
                    paddingLeft: 12,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isDark ? "#B0B0B0" : "#388E3C",
                      textAlign: "left",
                      fontStyle: "italic",
                      fontSize: 16,
                    }}>
                    {isBn ? "ঝুঁকির স্তর" : "Risk level"}
                  </Text>
                </View>
                <View
                  style={{
                    width: 1,
                    height: "100%",
                    backgroundColor: isDark ? "#333333" : "#E0E0E0",
                  }}></View>
                <View
                  style={{
                    paddingVertical: 12,
                    paddingRight: 12,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isRisk
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}>
                    {getRiskLevel(stockDetail?.aiRisk)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View>
            <Text
              style={{
                color: "#259500",
                fontSize: 16,
                textAlign: "center",
              }}>
              {isBn
                ? "🎉 আপনার লেনদেন সফলভাবে সম্পন্ন হয়েছে 🎉"
                : "🎉 Your trade was successfully placed 🎉"}
            </Text>
          </View>
        </View>
      </View>

      <View>
        <View
          style={{
            marginTop: 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              playButtonSound(require("@/assets/ipad_click.mp3"));
              router.dismissAll();
            }}
            style={{
              width: "100%",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 8,
              marginTop: 24,
              marginBottom: 32,
            }}>
            <LinearGradient
              colors={["#0056D2", "#1E90FF"]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 0,
              }}
              style={{
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}>
                <FontAwesome name="angle-left" size={20} color="#FFFFFF" />

                <Text
                  style={{
                    fontSize: 14,
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}>
                  {isBn ? "পোর্টফোলিওতে ফিরে যান" : "Back to Portfolio"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
