import {
  View,
  Text,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "../Themed";
import { LinearGradient } from "expo-linear-gradient";
import { SvgUri, SvgXml } from "react-native-svg";
import AnimatedInput from "./AnimatedInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import {
  activeRadioSvg,
  activeRadioSvgLight,
  radioSvg,
  radioSvgLight,
} from "../svgs/radio";
import useLang from "@/lib/hooks/useLang";
import { Audio } from "expo-av";
import { useAuth } from "@clerk/clerk-expo";
import { apiClientPortfolio } from "@/lib/api";
import { formatFloat } from "@/lib/utils";
import useUi from "@/lib/hooks/useUi";

export default function SellStockForm() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { refreash, setRefreash, refreshHold, setRefreshHold } = useUi();
  const { getToken } = useAuth();
  const clientPortfolio = apiClientPortfolio();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const params = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<string>("partialClose");
  const stockDetail = JSON.parse(params?.stockDetail as string);
  const currentPrice = parseFloat(stockDetail?.stock?.close.toString());

  const isNeg = false;
  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${stockDetail?.stock?.symbol}.svg`;

  const schema = z
    .object({
      closeType: z.enum(["fullClose", "partialClose"]).default("partialClose"),
      quantity: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.closeType === "partialClose") {
          return data.quantity !== "";
        }
        return true;
      },
      {
        message: "Required",
        path: ["quantity"],
      }
    );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      closeType: "partialClose",
      quantity: "",
    },
  });

  const values = watch();
  const isFormValid =
    watch("closeType") === "partialClose"
      ? Object.values(values).every((val) => val.trim() !== "")
      : true;

  const onSubmit = async (data: any) => {
    if (isFormValid) {
      const sound = new Audio.Sound();
      try {
        setIsSubmitting(true);
        const token = await getToken();
        const { data: sellData } = await clientPortfolio.post(
          "/portfolio/sell",
          {
            holdingId: stockDetail?.id.toString(),
            quantity:
              watch("closeType") === "fullClose"
                ? stockDetail?.quantity
                : data?.quantity,
          },
          token
        );
        console.log("sellData----------------------", sellData);
        setRefreash(!refreash);
        setRefreshHold(!refreshHold);
        setIsSubmitting(false);
        router.push({
          pathname: "/main/portfolio/sell-stock/placedOrder/[id]",
          params: {
            id: stockDetail?.id,
            stockDetail: JSON.stringify({
              ...stockDetail,
              closeType: watch("closeType"),
            }),
            soldDetails: JSON.stringify(sellData),
          },
        });
      } catch (error) {
        console.log(error);
        // Load the MP3 file
        await sound.loadAsync(require("../../assets/error.mp3")); // Replace with your MP3 path
        await sound.playAsync();
        // Wait for playback to finish
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync(); // Clean up
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const options = [
    {
      label: isBn ? "সম্পূর্ণ বিক্রয়" : "Full Close",
      value: "fullClose",
    },
    {
      label: isBn ? "আংশিক বিক্রয়" : "Partial Close",
      value: "partialClose",
    },
  ];
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setIsFocused(false);
        }}
        style={{
          flex: 1,
        }}>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}>
            <View
              style={{
                gap: 24,
                paddingHorizontal: 12,
              }}>
              <View
                style={{
                  shadowColor: isDark ? "transparent" : "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: isDark ? 0 : 0.1,
                  shadowRadius: 4,
                  elevation: isDark ? 0 : 4,
                }}>
                <LinearGradient
                  colors={
                    isDark ? ["#111111", "#1C1E36"] : ["#FFFFFF", "#F8F9FA"]
                  }
                  style={{
                    paddingVertical: 24,
                    borderWidth: 1,
                    borderColor: isDark ? "#262626" : "#E0E0E0",
                    borderRadius: 20,
                  }}>
                  <Image
                    source={
                      isDark
                        ? isNeg
                          ? require("@/assets/images/PortfolioGraphNegDark.png")
                          : require("@/assets/images/PortfolioGraphDark.png")
                        : isNeg
                        ? require("@/assets/images/PortfolioGraphNeg.png")
                        : require("@/assets/images/PortfolioGraph.png")
                    }
                    resizeMode="cover"
                    style={{
                      position: "absolute",
                      width: "100%",
                      top: 52,
                    }}
                  />
                  <View
                    style={{
                      gap: 40,
                      paddingHorizontal: 12,
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
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
                            {stockDetail?.stock?.symbol[0]}
                          </Text>
                        </View>
                        {logoUrl && (
                          <SvgUri
                            uri={logoUrl}
                            width={"100%"}
                            height={"100%"}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: isDark ? "#AAAAAA" : "#004662",
                          }}>
                          {stockDetail?.stock?.symbol}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        margin: "auto",
                        gap: 8,
                      }}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: isDark ? "#718096" : "#718096",
                          fontSize: 14,
                        }}>
                        {isBn ? "বর্তমান মূল্য" : "Current Price"}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: isDark ? "#FFFFFF" : "#1E88E5",
                          fontWeight: "bold",
                          fontSize: 28,
                        }}>
                        ৳{currentPrice}
                      </Text>
                    </View>

                    <View
                      style={{
                        gap: 40,
                        width: "100%",
                        paddingHorizontal: 14,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 40,
                          justifyContent: "center",
                        }}>
                        <Controller
                          control={control}
                          name="closeType"
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error },
                          }) => (
                            <>
                              {options.map((option, i) => {
                                const active = selectedOption === option.value;
                                return (
                                  <TouchableOpacity
                                    key={i}
                                    onPress={() => {
                                      setValue("closeType", option.value);
                                      setSelectedOption(option.value);
                                    }}
                                    style={{
                                      flexDirection: "row",
                                      gap: 8,
                                    }}>
                                    <View
                                      style={{
                                        width: 20,
                                        height: 20,
                                        position: "relative",
                                        alignItems: "center",
                                        shadowColor: !active
                                          ? isDark
                                            ? "transparent"
                                            : "#E0E0E0"
                                          : "transparent",
                                        shadowOffset: {
                                          width: 0,
                                          height: 4,
                                        },
                                        shadowOpacity: 1,
                                        shadowRadius: 4,
                                        elevation: 4,
                                      }}>
                                      <SvgXml
                                        style={{
                                          position: "absolute",
                                          left: 0,
                                          top: 0,
                                          width: "100%",
                                          height: "100%",
                                        }}
                                        pointerEvents="none"
                                        xml={
                                          isDark
                                            ? active
                                              ? activeRadioSvg
                                              : radioSvg
                                            : active
                                            ? activeRadioSvgLight
                                            : radioSvgLight
                                        }
                                      />
                                    </View>
                                    <View>
                                      <Text
                                        style={{
                                          color: active
                                            ? isDark
                                              ? "#00E676"
                                              : "#004D40"
                                            : isDark
                                            ? "#876"
                                            : "#757575",
                                          fontSize: 16,
                                          fontWeight: "medium",
                                        }}>
                                        {option.label}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </>
                          )}
                        />
                      </View>

                      {watch("closeType") === "partialClose" && (
                        <Controller
                          control={control}
                          name="quantity"
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error },
                          }) => (
                            <AnimatedInput
                              label={isBn ? "পরিমাণ" : "Enter Quantity"}
                              placeholder="00.00"
                              isDark={isDark} // Set to false for light mode
                              onChange={onChange} // Update value
                              value={value} // Pass current value
                              onBlur={onBlur} // Validation logic
                              error={error} // Optional error message
                              inputBorderColor={isDark ? "#E8E8E8" : "#C0C0C0"}
                              inputColor={
                                isDark
                                  ? ["#1C1C1C", "#1C1C1C"]
                                  : ["#FFFFFF", "#F7F7F7"]
                              }
                              inputShadow={{
                                shadowColor: isDark ? "#333333" : "#FFFFFF",
                                shadowOffset: {
                                  width: 4,
                                  height: 4,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 4,
                              }}
                              startColorOutRange={
                                isDark
                                  ? ["transparent", "#171723"]
                                  : ["#FFFFFF", "#FFFFFF"]
                              }
                              endColorOutRange={
                                isDark
                                  ? ["transparent", "#1C1C1C"]
                                  : ["#F7F7F7", "#FFFFFF"]
                              }
                            />
                          )}
                        />
                      )}
                    </View>

                    <View
                      style={
                        {
                          // shadowColor: "#E0E0E0",
                          // shadowOffset: { width: 0, height: 4 },
                          // shadowOpacity: 0.1,
                          // shadowRadius: 12,
                          // elevation: 4,
                        }
                      }>
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#1C1C1C", "#242424"]
                            : ["#F5F5F5", "#F5F5F5"]
                        }
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 16,
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.10)",
                          borderRadius: 12,
                        }}>
                        <View
                          style={{
                            gap: 20,
                          }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#A1A1A1" : "#909090",
                                  fontSize: 14,
                                }}>
                                {isBn ? "কেনার মূল্য" : "Buy Price"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                ৳{formatFloat(stockDetail?.avgCost)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#A1A1A1" : "#909090",
                                  fontSize: 14,
                                }}>
                                {isBn ? "বিক্রির মূল্য" : "Sell at Price"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                ৳{formatFloat(stockDetail?.stock?.close)}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#A1A1A1" : "#909090",
                                  fontSize: 14,
                                }}>
                                {isBn ? "কেনার পরিমাণ" : "Sell Quantity"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                {watch("closeType") === "fullClose"
                                  ? stockDetail?.quantity
                                  : watch("quantity")
                                  ? watch("quantity")
                                  : stockDetail?.quantity}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#A1A1A1" : "#909090",
                                  fontSize: 14,
                                }}>
                                {isBn
                                  ? "মোট বিক্রয় পরিমাণ"
                                  : "Total Sell Amount"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                ৳
                                {formatFloat(
                                  watch("closeType") === "fullClose"
                                    ? stockDetail?.stock?.close *
                                        stockDetail?.quantity
                                    : stockDetail?.stock?.close *
                                        Number(watch("quantity"))
                                )}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                router.dismissAll();
                              }}
                              style={{
                                flex: 1,
                                shadowColor: "#FF8A80",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.4 : 1,
                                shadowRadius: 4,
                                elevation: 4,
                              }}>
                              <LinearGradient
                                colors={["#D32F2F", "#FF6F61"]}
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
                                  paddingHorizontal: 8,
                                  paddingVertical: 12,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "#FFFFFF",
                                  }}>
                                  {isBn ? "বাতিল করুন" : "Cancel"}
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                              // disabled={!isFormValid}
                              onPress={handleSubmit(onSubmit)}
                              style={{
                                flex: 1,
                                shadowColor: isSubmitting
                                  ? "transparent"
                                  : isDark
                                  ? "#00B8D4"
                                  : "#81D4FA",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isSubmitting
                                  ? 0
                                  : isDark
                                  ? 0.4
                                  : 1,
                                shadowRadius: 4,
                                elevation: 4,
                              }}>
                              <LinearGradient
                                colors={
                                  isSubmitting
                                    ? isDark
                                      ? ["#3C3C47", "#3C3C47"]
                                      : ["#E0E0E0", "#E0E0E0"]
                                    : ["#00E5FF", "#2979FF"]
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
                                  borderRadius: 12,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingHorizontal: 8,
                                  paddingVertical: 12,
                                  opacity:
                                    isFormValid || !isSubmitting ? 1 : 0.2,
                                }}>
                                {isSubmitting ? (
                                  <ActivityIndicator size={"small"} />
                                ) : (
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: "#FFFFFF",
                                    }}>
                                    {isBn ? "বিক্রি করুন" : "Sell Now"}
                                  </Text>
                                )}
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
