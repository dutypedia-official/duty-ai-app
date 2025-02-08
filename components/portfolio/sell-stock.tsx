import { apiClientPortfolio } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import {
  calcBroFeeAmount,
  formatFloat,
  // getProfitOrLoss,
  getRiskLevel,
  isHighRisk,
  playButtonSound,
} from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function SellStock() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { refreshHold, setRefreshHold, totalInvestment, balance, freeBalance } =
    useUi();
  const { setTemplate, setActiveConversationId, setPrompt } = useChat();
  const { getToken } = useAuth();
  const isFocused = useIsFocused();
  const clientPortfolio = apiClientPortfolio();
  const [isLoading, setIsLoading] = useState(true);
  const [stockDetail, setStockDetail] = useState<any>();

  const fetchData = async (init: boolean = true) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/holding/${params?.id}`,
        token
      );
      setStockDetail(data);
      setRefreshHold(!refreshHold);
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

  const totalBuy = stockDetail?.avgCost * stockDetail?.quantity;
  const data = [
    {
      name: isBn ? "ক্রয় মূল্য" : "Buy Price",
      value: `৳${formatFloat(stockDetail?.avgCost)}`,
    },
    {
      name: isBn ? "পরিমাণ" : "Quantity ",
      value: `${stockDetail?.quantity}`,
    },
    {
      name: isBn ? "ব্রোকার ফি" : "Broker Fee",
      value: `৳${calcBroFeeAmount(stockDetail?.brokerFee, totalBuy)} (${
        stockDetail?.brokerFee
      }%)`,
    },
    {
      name: isBn ? "মোট ক্রয় পরিমাণ" : "Total Buy Amount",
      value: `৳${formatFloat(stockDetail?.total)}`,
    },
  ];

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${stockDetail?.stock?.symbol}.svg`;

  const isRisk = isHighRisk(stockDetail?.risk) === "true" ? true : false;

  const isInitialRisk =
    isHighRisk(stockDetail?.initialRisk) === "true" ? true : false;

  const isLoss = stockDetail?.profit?.toString().startsWith("-") ? true : false;

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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
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
                    color: isDark ? "#B0B0B0" : "#004662",
                    textAlign: "center",
                    fontStyle: "italic",
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
                const even = i % 2 === 0;
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
                        ? even
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
                  backgroundColor: isDark ? "#141414" : "#fff",
                }}>
                <View
                  style={{
                    paddingVertical: 12,
                    paddingLeft: 12,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: isInitialRisk
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}>
                    {isBn ? "প্রাথমিক ঝুঁকি" : "Initial Risk"}
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
                      color: isInitialRisk
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}>
                    {formatFloat(stockDetail?.initialRisk)}%
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderColor: isDark ? "#333333" : "#E0E0E0",
                  backgroundColor: isDark ? "#1A1A1A" : "#F6F6F6",
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
                    {isBn ? "বর্তমান ঝুঁকি" : "Current Risk"}
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
                    {formatFloat(stockDetail?.risk)}%
                  </Text>
                </View>
              </View>
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
                    {getRiskLevel(stockDetail?.risk)}
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
                  backgroundColor: isLoss
                    ? isDark
                      ? "#4D0D0D"
                      : "#FFEBEE"
                    : isDark
                    ? "#004D40"
                    : "#B3FFB9",
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
                    {stockDetail?.profit?.toString().startsWith("-")
                      ? isBn
                        ? "লস"
                        : "Loss"
                      : isBn
                      ? "লাভ"
                      : "Profit"}
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
                      color: isLoss
                        ? "#FF6E6E"
                        : isDark
                        ? "#00FF88"
                        : "#388E3C",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}>
                    {formatFloat(stockDetail?.profit)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View>
            <View
              style={{
                marginTop: 24,
              }}>
              <LinearGradient
                colors={
                  isDark ? ["#1C1C1C", "#242424"] : ["#F6F6F6", "#F6F6F6"]
                }
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E0E0E0",
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      playButtonSound(require("@/assets/ipad_click.mp3"));
                      router.push({
                        pathname:
                          "/main/portfolio/sell-stock/sell-stock-form/[id]",
                        params: {
                          id: stockDetail?.id,
                          stockDetail: JSON.stringify(stockDetail),
                        },
                      });
                    }}
                    style={{
                      flex: 1,
                      shadowColor: "#FF3C3C",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.4,
                      shadowRadius: 4,
                      elevation: 4,
                    }}>
                    <LinearGradient
                      colors={["#FF6E6F", "#FF4D4F"]}
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
                        paddingVertical: 12,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#FFFFFF",
                        }}>
                        {isBn ? "বিক্রি করুন" : "Sell"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      playButtonSound(require("@/assets/ipad_click.mp3"));
                      WebBrowser.openBrowserAsync(
                        `https://www.tradingview.com/chart/?symbol=DSEBD:${stockDetail?.stock?.symbol}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=DSEBD:${stockDetail?.stock?.symbol}&theme=${colorScheme}`,
                        {
                          showTitle: false,
                          enableBarCollapsing: false,
                        }
                      );
                    }}
                    style={{
                      flex: 1,
                      shadowColor: "#1D4EDD",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      elevation: 4,
                    }}>
                    <LinearGradient
                      colors={["#3399FF", "#0066FF"]}
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
                        paddingVertical: 12,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#FFFFFF",
                        }}>
                        {isBn ? "চার্ট দেখুন" : "View Chart"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      playButtonSound(require("@/assets/ipad_click.mp3"));
                      setTemplate("finance");
                      setActiveConversationId(null);
                      setPrompt(
                        `I have some stock in DSEBD: ${
                          stockDetail?.stock?.symbol
                        } company. My stock details: Buy Price: ${formatFloat(
                          stockDetail?.avgCost
                        )}৳ Quantity: ${stockDetail?.quantity} Broker Fee: ${
                          stockDetail?.brokerFee
                        }% Total Buy Amount: ${formatFloat(
                          stockDetail?.total
                        )}৳ and current stock price is ${
                          stockDetail?.stock?.close
                        }৳. Should I sell this stock at this price?`
                      );
                      router.push({
                        pathname: "/main/portfolio/chat",
                        params: { fromPath: "list" },
                      });
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
                      colors={["#00E5FF", "#2979FF"]}
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
                        paddingVertical: 12,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#FFFFFF",
                        }}>
                        {isBn ? "এআই জিজ্ঞাসা" : "Ask Ai"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
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
                colors={
                  isDark ? ["#0056D2", "#1E90FF"] : ["#007BFF", "#004AAD"]
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
      </ScrollView>
    </View>
  );
}
