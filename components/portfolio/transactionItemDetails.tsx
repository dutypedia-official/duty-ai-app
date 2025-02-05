import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import useLang from "@/lib/hooks/useLang";
import { format } from "date-fns";
import {
  calcBroFeeAmount,
  formatFloat,
  getRiskLevel,
  isLossItem,
} from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { useIsFocused } from "@react-navigation/native";
import { apiClientPortfolio } from "@/lib/api";

export default function TransactionItemDetails() {
  const { getToken } = useAuth();
  const isFocused = useIsFocused();
  const clientPortfolio = apiClientPortfolio();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const [stockDetail, setStockDetail] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  // const stockDetail = JSON.parse(params?.stockDetail as string);
  const isRisk = false;

  const fetchData = async (init: boolean = true) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/transaction/${params?.id}`,
        token
      );
      console.log("data------------------", JSON.stringify(data));

      setStockDetail(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("stockDetail------------------", stockDetail);

  const data = [
    {
      name: isBn ? "ক্রয় মূল্য" : "Buy Price",
      value: `৳${formatFloat(stockDetail?.buyPrice)}`,
    },
    {
      name: isBn ? "বিক্রয় মূল্য" : "Sell Price",
      value: `৳${stockDetail?.sellPrice}`,
    },
    {
      name: isBn ? "পরিমাণ" : "Quantity ",
      value: `${stockDetail?.totalQuantity}`,
    },
    {
      name: isBn ? "মোট ক্রয় পরিমাণ" : "Total Buy Amount",
      value: `৳${formatFloat(stockDetail?.totalBuyPrice)}`,
    },
    {
      name: isBn ? "মোট বিক্রয় পরিমাণ" : "Total Sell Amount",
      value: `৳${stockDetail?.totalSellPrice}`,
    },
    {
      name: isBn ? "মোট বিক্রয়কৃত পরিমাণ" : "Total Quantity Sold",
      value: stockDetail?.quantity,
    },
    {
      name: isBn ? "ব্রোকার ফি" : "Broker Fee",
      value: `৳${calcBroFeeAmount(
        stockDetail?.brokerFee,
        stockDetail?.totalSellPrice
      )} (${stockDetail?.brokerFee}%)`,
    },
    {
      name: isBn ? "বন্ধের তারিখ" : "Close Date",
      value: stockDetail
        ? format(new Date(stockDetail?.createdAt), "MMM dd, yyyy")
        : "",
    },
  ];

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${stockDetail?.stock?.symbol}.svg`;

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View
      style={{
        marginTop: 24,
        paddingHorizontal: 12,
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
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
                  {stockDetail?.stock?.symbol[0]}
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
                {stockDetail?.stock?.symbol}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#B0B0B0" : "#7D8C8D",
                  textAlign: "center",
                }}>
                Trade Date{" "}
                {stockDetail
                  ? format(new Date(stockDetail?.createdAt), "MMM dd, yyyy")
                  : ""}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            {data?.map((item, i) => {
              const odd = i % 2 === 1;
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderColor: isDark ? "#333333" : "#E0E0E0",
                    backgroundColor: isDark
                      ? odd
                        ? "#141414"
                        : "#1A1A1A"
                      : odd
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
                    color: isRisk ? "#FF6E6E" : isDark ? "#00FF88" : "#388E3C",
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
                    color: isRisk ? "#FF6E6E" : isDark ? "#00FF88" : "#388E3C",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}>
                  {formatFloat(stockDetail?.risk)}%
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomEndRadius: 16,
                borderBottomStartRadius: 16,
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
                    color: isRisk ? "#FF6E6E" : isDark ? "#00FF88" : "#388E3C",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}>
                  {getRiskLevel(stockDetail?.risk)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View>
          <View
            style={{
              marginTop: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: isRisk
                  ? isDark
                    ? "#4D0D0D"
                    : "#FFEBEE"
                  : isDark
                  ? "#004D40"
                  : "#E8F5E9",
                borderRadius: 12,
                borderWidth: 4,
                borderColor: isDark ? "transparent" : "#E0E0E0",
              }}>
              <View
                style={{
                  paddingVertical: 12,
                  paddingLeft: 12,
                  flex: 1,
                }}>
                <Text
                  style={{
                    color: isRisk ? "#FF6E6E" : isDark ? "#00FF88" : "#388E3C",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}>
                  {isRisk ? (isBn ? "লস" : "Losses") : isBn ? "লাভ" : "Profit"}
                </Text>
              </View>

              <View
                style={{
                  paddingVertical: 12,
                  paddingRight: 12,
                  flex: 1,
                }}>
                <Text
                  style={{
                    color: isRisk ? "#FF6E6E" : isDark ? "#00FF88" : "#388E3C",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}>
                  {isRisk ? "-" : "✅ +"}৳
                  {isRisk
                    ? formatFloat(
                        stockDetail?.loss?.toString().replace(/[-+]/g, "")
                      )
                    : formatFloat(
                        stockDetail?.profit?.toString().replace(/[-+]/g, "")
                      )}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
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
              colors={isDark ? ["#0056D2", "#1E90FF"] : ["#0056D2", "#007BFF"]}
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
