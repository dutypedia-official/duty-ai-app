import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import useLang from "@/lib/hooks/useLang";

export default function ConfirmSellStock() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";

  const data = [
    {
      name: isBn ? "ক্রয় মূল্য" : "Buy Price",
      value: "৳100",
    },

    {
      name: isBn ? "পরিমাণ" : "Quantity ",
      value: "100",
    },
    {
      name: isBn ? "ব্রোকার ফি" : "Broker Fee",
      value: "৳100 (5%)",
    },
    {
      name: isBn ? "মোট ক্রয় পরিমাণ" : "Total Buy Amount",
      value: "৳100",
    },
  ];
  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${params?.id}.svg`;
  const isRisk = params?.isRisk === "true";

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
                    {params?.id[0]}
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
                  {params?.id}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#B0B0B0" : "#004662",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}>
                  Trade Date Jan 15, 2025
                </Text>
                <Text
                  style={{
                    marginTop: 16, //20
                    fontSize: 14,
                    color: isDark ? "#B0B0B0" : "#004662",
                  }}>
                  Ai Guidline : যদি আপনার ব্যালেন্স 100,000 BDT হয় এবং আপনি 10
                  BDT মূল্যে 1,000 শেয়ার কিনতে চান, তাহলে স্টপ-লস 8 BDT
                  রাখলে..Read more..
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
                    Risk
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
                    5%
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
                    {isRisk ? "⚠️ High Risk" : "🟢 Good"}
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
                    {isRisk ? (isBn ? "লস" : "Loss") : isBn ? "লাভ" : "Profit"}
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
                    {isRisk ? "-৳1200" : "+৳12000"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      <View>
        <View
          style={{
            marginTop: 24,
          }}>
          <TouchableOpacity
            onPress={() => {
              router.dismissTo({
                pathname: "/main/setting/buy-stock/placedOrder/[id]",
                params: {
                  id: params?.id.toString(),
                },
              });
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
                <Text
                  style={{
                    fontSize: 14,
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}>
                  {isBn ? "নিশ্চিত করুন" : "Confirm"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
