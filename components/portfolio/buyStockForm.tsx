import useLang from "@/lib/hooks/useLang";
import { formatFloat } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { z } from "zod";
import { SafeAreaView } from "../Themed";
import AnimatedInput from "./AnimatedInput";

// const schema = z.object({
//   buyPrice: z
//     .string({
//       required_error: "Required",
//     })
//     .min(1, {
//       message: "Required",
//     }),
//   quantity: z
//     .string({
//       required_error: "Required",
//     })
//     .min(1, {
//       message: "Required",
//     }),
//   brokerFee: z
//     .string({
//       required_error: "Required",
//     })
//     .min(1, {
//       message: "Required",
//     }),
// });

export default function BuyStockForm() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const params = useLocalSearchParams();
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stockItem = JSON.parse(params?.stockItem as string);
  const currentPrice = formatFloat(stockItem?.close);
  const isNeg = false;
  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${stockItem?.symbol}.svg`;

  const buySchema = z.object({
    symbolId: z.string().min(1),
    buyPrice: z.coerce.number().min(1).default(stockItem?.close),
    quantity: z.coerce.number().min(1),
    brokerFee: z.coerce.number().min(0).max(100).default(0),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(buySchema),
    defaultValues: {
      symbolId: stockItem?.id.toString(),
      buyPrice: Number(stockItem?.close).toFixed(2) ?? "",
      quantity: "",
      brokerFee: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    if (isFormValid) {
      try {
        setIsSubmitting(true);
        console.log("Form submitted:", data);
        setIsSubmitting(false);
        router.push({
          pathname: "/main/portfolio/buy-stock/confirm/[id]",
          params: {
            id: stockItem?.id.toString(),
            stockDetail: JSON.stringify({
              ...stockItem,
              buyPrice: data?.buyPrice,
              quantity: data?.quantity,
              brokerFee: data?.brokerFee,
            }),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    reset();
    setIsSubmitting(false);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
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
                    isDark ? ["#1A1A1A", "#1C1C1C"] : ["#FFFFFF", "#F8F9FA"]
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
                    resizeMode="stretch"
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
                            {stockItem?.symbol[0]}
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
                          {stockItem?.symbol}
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
                          color: isDark ? "#FFFFFF" : "#000",
                          fontWeight: "bold",
                          fontSize: 28,
                        }}>
                        ৳{currentPrice}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginTop: 38,
                        gap: 32,
                        width: "100%",
                        paddingHorizontal: 14,
                      }}>
                      <Controller
                        control={control}
                        name="buyPrice"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => {
                          return (
                            <AnimatedInput
                              inputMode="numeric"
                              label={isBn ? "ক্রয় মূল্য" : "Buy Price"}
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
                                  ? ["transparent", "#1A1A1A"]
                                  : ["#FCFCFC", "#FCFCFD"]
                              }
                              endColorOutRange={
                                isDark
                                  ? ["transparent", "#1C1C1C"]
                                  : ["#FCFCFC", "#FFFFFF"]
                              }
                            />
                          );
                        }}
                      />
                      <Controller
                        control={control}
                        name="quantity"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <AnimatedInput
                            inputMode="numeric"
                            label={isBn ? "পরিমাণ" : "Quantity"}
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
                                ? ["transparent", "#1A1A1A"]
                                : ["#FCFCFC", "#FCFCFD"]
                            }
                            endColorOutRange={
                              isDark
                                ? ["transparent", "#1C1C1C"]
                                : ["#FCFCFC", "#FFFFFF"]
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="brokerFee"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <AnimatedInput
                            inputMode="text"
                            label={
                              isBn ? "ব্রোকার কমিশন %" : "Broker commission %"
                            }
                            placeholder="5%"
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
                                ? ["transparent", "#1A1A1A"]
                                : ["#FCFCFC", "#FCFCFD"]
                            }
                            endColorOutRange={
                              isDark
                                ? ["transparent", "#1C1C1C"]
                                : ["#FCFCFC", "#FFFFFF"]
                            }
                          />
                        )}
                      />
                    </View>

                    <View
                      style={{
                        shadowColor: isDark ? "transparent" : "#E0E0E0",
                        shadowOffset: { width: 0, height: isDark ? 0 : 4 },
                        shadowOpacity: isDark ? 0 : 1,
                        shadowRadius: isDark ? 0 : 12,
                        elevation: isDark ? 0 : 4,
                      }}>
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
                                {isBn ? "কেনার মূল্য" : "Buy at price"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                ৳{watch("buyPrice") || 0}
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
                                {isBn ? "কেনার পরিমাণ" : "Quantity"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                {watch("quantity") ? watch("quantity") : 0}
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
                                {isBn ? "ব্রোকার কমিশন" : "Broker commission"}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: isDark ? "#ffff" : "#2D3748",
                                  fontWeight: "medium",
                                  fontSize: 20,
                                }}>
                                {watch("brokerFee") ? watch("brokerFee") : 0}%
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
                                router.back();
                              }}
                              style={{
                                flex: 1,
                                shadowColor: "#FF4500",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 4,
                                elevation: 4,
                              }}>
                              <LinearGradient
                                colors={["#FF3C3C", "#FF5757"]}
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
                              // disabled={
                              //   !isFormValid || isSubmitting ? true : false
                              // }
                              onPress={() => handleSubmit(onSubmit)()}
                              style={{
                                flex: 1,
                                shadowColor:
                                  !isFormValid || isSubmitting
                                    ? "transparent"
                                    : "#1E90FF",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 4,
                                elevation: 4,
                              }}>
                              <LinearGradient
                                colors={
                                  !isFormValid || isSubmitting
                                    ? isDark
                                      ? ["#3C3C47", "#3C3C47"]
                                      : ["#E0E0E0", "#E0E0E0"]
                                    : ["#357AE8", "#1D4EDD"]
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
                                  opacity: !isFormValid ? 0.2 : 1,
                                }}>
                                {isSubmitting ? (
                                  <ActivityIndicator size={"small"} />
                                ) : (
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: !isFormValid
                                        ? isDark
                                          ? "#666666"
                                          : "#A0A0A0"
                                        : isDark
                                        ? "#FFFFFF"
                                        : "#FFFFFF",
                                    }}>
                                    {isBn ? "কিনুন" : "Buy"}
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
