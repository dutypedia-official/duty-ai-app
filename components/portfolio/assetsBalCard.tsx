import { SafeAreaView } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DepositCard from "./depositCard";
import WithdrawCard from "./withdrawCard";
import { formatFloat, formattedBalance } from "@/lib/utils";
import useLang from "@/lib/hooks/useLang";
import { Portal } from "react-native-paper";
import useUi from "@/lib/hooks/useUi";
import { useUser } from "@clerk/clerk-expo";

export default function AssetsBalCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { user } = useUser();
  const { totalInvestment, freeBalance, balance, totalCurrentMarketValue } =
    useUi();
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const currentProfit =
    Number(totalCurrentMarketValue) - Number(totalInvestment);
  const logoUrl = user?.imageUrl;
  const isNeg = false;

  return (
    <SafeAreaView>
      <View
        style={{
          gap: 24,
        }}>
        <LinearGradient
          colors={isDark ? ["#1A1A1A", "#1A1A1A"] : ["#FFFFFF", "#F8F9FA"]}
          style={{
            marginHorizontal: 12,
            paddingVertical: 16,

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
              bottom: isDark ? 0 : 16,
            }}
          />
          <View
            style={{
              paddingHorizontal: 12,
            }}>
            <View
              style={{
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
              }}>
              <View
                style={{
                  borderRadius: 999,
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}>
                <LinearGradient
                  colors={
                    isDark ? ["#FFD700", "#FFA500"] : ["#FFD700", "#FFD700"]
                  }
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    overflow: "hidden",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                  }}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 999,
                      alignContent: "center",
                      justifyContent: "center",
                    }}>
                    {!logoUrl && (
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 12,
                          color: "#1E1E1E",
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}>
                        {user?.firstName![0]}
                      </Text>
                    )}
                    {logoUrl && (
                      <Image
                        source={{ uri: logoUrl }}
                        style={{
                          borderRadius: 999,
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    )}
                  </View>
                </LinearGradient>
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                  flexShrink: 1,
                  justifyContent: "space-between",
                  flex: 1,
                  gap: 8,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#fff" : "#777777",
                  }}
                  numberOfLines={1}>
                  Hello
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: isDark ? "#FFFFFF" : "#2C3E50",
                  }}
                  numberOfLines={1}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>
            {/* {isLoading ? (
              <View
                style={{
                  height: 142,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <ActivityIndicator />
              </View>
            ) : ( */}
            <View
              style={{
                margin: "auto",
                gap: 8,
                paddingVertical: 24,
              }}>
              <Text
                style={{
                  textAlign: "center",
                  color: isDark ? "#718096" : "#718096",
                  fontSize: 14,
                }}>
                {isBn ? "মোট বিনিয়োগ" : "Total Investment"}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: isDark ? "#FFFFFF" : "#000",
                  fontWeight: "bold",
                  fontSize: 28,
                }}>
                ৳{formattedBalance(parseFloat(totalInvestment))}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: currentProfit >= 0 ? "#28A745" : "#CE1300",
                  fontWeight: "medium",
                  fontSize: 16,
                }}>
                {currentProfit >= 0
                  ? `+৳${currentProfit.toFixed(2)}`
                  : `-৳${currentProfit.toFixed(2)}`}
              </Text>
            </View>
            {/* )} */}
            <View
              style={{
                backgroundColor: isDark ? "#131313" : "#F3F2F2",
                paddingHorizontal: 12,
                paddingVertical: 16,
                borderRadius: 12,
                gap: 16,
                borderWidth: isDark ? 1 : 0,
                borderColor: "#262626",
                shadowColor: isDark ? "transparent" : "#E0E0E0",
                shadowOffset: {
                  width: 0,
                  height: isDark ? 0 : 4,
                },
                shadowRadius: isDark ? 0 : 12,
                shadowOpacity: isDark ? 0 : 0.1,
              }}>
              <View
                style={{
                  gap: 12,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#4A5568",
                        fontSize: 14,
                      }}>
                      {isBn ? "লেনদেনের ব্যালেন্স" : "Trading Balance"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#2D3748",
                        fontSize: 20,
                        fontWeight: "medium",
                      }}>
                      ৳{parseFloat(balance).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#D4AF37" : "#2E7582",
                        fontSize: 14,
                      }}>
                      {isBn ? "ফ্রি ক্যাশ" : "Free cash"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#D4AF37" : "#2E7582",
                        fontSize: 14,
                      }}>
                      ৳{parseFloat(freeBalance).toFixed(2)}
                    </Text>
                  </View>
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
                    setIsDeposit(true);
                  }}
                  style={{
                    flex: 1,
                    shadowColor: "#1E90FF",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                  }}>
                  <LinearGradient
                    colors={["#1E90FF", "#007BFF"]}
                    start={{
                      x: 0,
                      y: 0,
                    }}
                    end={{
                      x: 1,
                      y: 0,
                    }}
                    style={{
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 8,
                      paddingVertical: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#FFFFFF",
                      }}>
                      {isBn ? "জমা করুন" : "Deposit"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsWithdraw(true);
                  }}
                  style={{
                    flex: 1,
                    shadowColor:
                      totalInvestment === "0" ? "transparent" : "#FF4500",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: totalInvestment === "0" ? 0 : 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                  }}>
                  <LinearGradient
                    colors={
                      totalInvestment === "0"
                        ? isDark
                          ? ["#3C3C47", "#3C3C47"]
                          : ["#E0E0E0", "#E0E0E0"]
                        : ["#FF6347", "#FF4500"]
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
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 8,
                      paddingVertical: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: totalInvestment === "0" ? "#A0A0A0" : "#FFFFFF",
                      }}>
                      {isBn ? "উত্তোলন করুন" : "Withdraw"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
      <Portal>
        <DepositCard open={isDeposit} setOpen={setIsDeposit} />
        <WithdrawCard open={isWithdraw} setOpen={setIsWithdraw} />
      </Portal>
    </SafeAreaView>
  );
}
