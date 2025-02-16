import { SafeAreaView } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import DepositCard from "./depositCard";
import WithdrawCard from "./withdrawCard";
import { formatFloat, playButtonSound } from "@/lib/utils";
import useLang from "@/lib/hooks/useLang";
import { Portal } from "react-native-paper";
import useUi from "@/lib/hooks/useUi";
import { useUser } from "@clerk/clerk-expo";
import { Audio } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import ResetPortfolioCard from "./resetPortfolio";

export default function AssetsBalCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { user } = useUser();
  const {
    totalInvestment,
    freeBalance,
    balance,
    totalCurrentMarketValue,
    totalBrokerFee,
    resetPortfolioDrop,
    setResetPortfolioDrop,
  } = useUi();
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [resetCardOpen, setResetCardOpen] = useState(false);
  const currentProfit =
    Number(totalCurrentMarketValue) -
    (Number(totalInvestment) + Number(totalBrokerFee));

  console.log("currentProfit----------", currentProfit);
  console.log("freeBalance----------", freeBalance);

  const logoUrl = user?.imageUrl;
  const isNeg = currentProfit >= 0 ? false : true;

  const depositDisable = Math.trunc(Number(balance) * 100) / 100 >= 1000000000;

  const isWithdrawDisabled = formatFloat(freeBalance) === "0.00";

  return (
    <SafeAreaView>
      <View
        style={{
          gap: 24,
        }}
      >
        <LinearGradient
          colors={isDark ? ["#1A1A1A", "#1A1A1A"] : ["#FFFFFF", "#F8F9FA"]}
          style={{
            marginHorizontal: 12,
            paddingVertical: 16,

            borderWidth: 1,
            borderColor: isDark ? "#262626" : "#E0E0E0",
            borderRadius: 20,
          }}
        >
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
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  backgroundColor: "transparent",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 999,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
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
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#FFFFFF",
                          borderRadius: 999,
                          alignContent: "center",
                          justifyContent: "center",
                        }}
                      >
                        {!logoUrl && (
                          <Text
                            style={{
                              fontWeight: "700",
                              fontSize: 12,
                              color: "#1E1E1E",
                              textAlign: "center",
                              textAlignVertical: "center",
                            }}
                          >
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
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#fff" : "#777777",
                      }}
                      numberOfLines={1}
                    >
                      Hello
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: isDark ? "#FFFFFF" : "#2C3E50",
                      }}
                      numberOfLines={1}
                    >
                      {user?.firstName} {user?.lastName}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    playButtonSound(require("@/assets/ipad_click.mp3"));
                    setResetPortfolioDrop(!resetPortfolioDrop);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: "transparent",
                    borderRadius: 999,
                  }}
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={20}
                    color={isDark ? "#fff" : "#212121"}
                  />
                </TouchableOpacity>
              </View>
              {resetPortfolioDrop && (
                <TouchableOpacity
                  onPress={() => {
                    playButtonSound(require("@/assets/ipad_click.mp3"));
                    setResetCardOpen(true);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 40,
                    padding: 10,
                    backgroundColor: isDark ? "#FFFFFF" : "#FFFFFF",
                    width: isDark ? 120 : 150,
                    borderWidth: 1,
                    borderColor: isDark ? "#FFCE01" : "#D9D9D9",
                    borderRadius: 4,
                    zIndex: 100000000,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDark ? "#333333" : "#333333",
                      textAlign: "center",
                    }}
                  >
                    {isBn ? "পোর্টফলিও রিসেট করুন" : "Reset portfolio"}
                  </Text>
                </TouchableOpacity>
              )}
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
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: isDark ? "#718096" : "#718096",
                  fontSize: 14,
                }}
              >
                {isBn ? "মোট বিনিয়োগ" : "Total Investment"}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: isDark ? "#FFFFFF" : "#000",
                  fontWeight: "bold",
                  fontSize: 28,
                }}
              >
                ৳{formatFloat(Number(totalInvestment))}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: currentProfit >= 0 ? "#28A745" : "#CE1300",
                  fontWeight: "medium",
                  fontSize: 16,
                }}
              >
                {currentProfit === 0.0
                  ? `৳${formatFloat(Math.abs(currentProfit))}`
                  : currentProfit >= 0
                  ? `+৳${formatFloat(Math.abs(currentProfit))}`
                  : `-৳${formatFloat(Math.abs(currentProfit))}`}
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
              }}
            >
              <View
                style={{
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#4A5568",
                        fontSize: 14,
                      }}
                    >
                      {isBn ? "লেনদেনের ব্যালেন্স" : "Trading Balance"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#fff" : "#2D3748",
                        fontSize: 20,
                        fontWeight: "medium",
                      }}
                    >
                      ৳{formatFloat(balance)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#D4AF37" : "#2E7582",
                        fontSize: 14,
                      }}
                    >
                      {isBn ? "ফ্রি ক্যাশ" : "Free cash"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: isDark ? "#D4AF37" : "#2E7582",
                        fontSize: 14,
                      }}
                    >
                      ৳{formatFloat(freeBalance)}
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
                }}
              >
                <TouchableOpacity
                  disabled={depositDisable}
                  onPress={() => {
                    playButtonSound(require("@/assets/ipad_click.mp3"));
                    setIsDeposit(true);
                  }}
                  style={{
                    flex: 1,
                    shadowColor: depositDisable ? "transparent" : "#1E90FF",
                    shadowOffset: {
                      width: 0,
                      height: depositDisable ? 0 : 2,
                    },
                    shadowOpacity: depositDisable ? 1 : 0.4,
                    shadowRadius: depositDisable ? 0 : 4,
                    elevation: depositDisable ? 0 : 4,
                  }}
                >
                  <LinearGradient
                    colors={
                      depositDisable
                        ? isDark
                          ? ["#3C3C47", "#3C3C47"]
                          : ["#E0E0E0", "#E0E0E0"]
                        : ["#1E90FF", "#007BFF"]
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
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#FFFFFF",
                      }}
                    >
                      {isBn ? "জমা করুন" : "Deposit"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isWithdrawDisabled ? true : false}
                  onPress={() => {
                    playButtonSound(require("@/assets/ipad_click.mp3"));
                    setIsWithdraw(true);
                  }}
                  style={{
                    flex: 1,
                    shadowColor: isWithdrawDisabled ? "transparent" : "#FF4500",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isWithdrawDisabled ? 0 : 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <LinearGradient
                    colors={
                      isWithdrawDisabled
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
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: isWithdrawDisabled ? "#A0A0A0" : "#FFFFFF",
                      }}
                    >
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
        <ResetPortfolioCard
          open={resetCardOpen}
          setOpen={setResetCardOpen}
          setClose={setResetPortfolioDrop}
        />
      </Portal>
    </SafeAreaView>
  );
}
