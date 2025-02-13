import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React, { Fragment } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { format } from "date-fns";
import { router } from "expo-router";
import { formatFloat, playButtonSound } from "@/lib/utils";

export default function TransactionTabContent({
  activeTab,
  isLast,
  item,
}: {
  activeTab: any;
  isLast: any;
  item: any;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // console.log("item--------------", item);

  const logoUrl = `https://s3-api.bayah.app/cdn/symbol/logo/${item?.stock?.symbol}.svg`;

  return (
    <Fragment>
      {activeTab === "profit" && (
        <TouchableOpacity
          onPress={() => {
            playButtonSound(require("@/assets/ipad_click.mp3"));
            router.push({
              pathname: "/main/portfolio/transaction-history/[id]",
              params: {
                id: item?.id.toString(),
              },
            });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingVertical: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderColor: isDark ? "#202020" : "#F1F1F1",
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  overflow: "hidden",
                  backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                  position: "relative",
                  // shadowColor: "#000000",
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.1,
                  // shadowRadius: 4,
                  // elevation: 4,
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
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
                    {item?.stock?.symbol[0]}
                  </Text>
                </View>
                {logoUrl && <SvgUri uri={logoUrl} width={20} height={20} />}
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: "medium",
                    color: isDark ? "#87CEEB" : "#004662",
                  }}>
                  {item?.stock?.symbol}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}>
            <View
              style={{
                flex: 1,
                paddingRight: 6,
                justifyContent: "flex-end",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#28A745" : "#28A745",
                  }}>
                  +৳{formatFloat(Math.abs(item?.profit))}
                </Text>
              </View>
            </View>
            <View>
              <FontAwesome
                name="angle-right"
                size={24}
                color={isDark ? "#4A5568" : "#4A5568"}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
      {activeTab === "losses" && (
        <TouchableOpacity
          onPress={() => {
            playButtonSound(require("@/assets/ipad_click.mp3"));
            router.push({
              pathname: "/main/portfolio/transaction-history/[id]",
              params: {
                id: item?.id,
                stockDetail: JSON.stringify(item),
                isRisk: "true",
              },
            });
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingVertical: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderColor: isDark ? "#202020" : "#F1F1F1",
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  overflow: "hidden",
                  backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                  position: "relative",
                  // shadowColor: "#000000",
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.1,
                  // shadowRadius: 4,
                  // elevation: 4,
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
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
                    {item?.stock?.symbol[0]}
                  </Text>
                </View>
                {logoUrl && <SvgUri uri={logoUrl} width={20} height={20} />}
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: "medium",
                    color: isDark ? "#87CEEB" : "#004662",
                  }}>
                  {item?.stock?.symbol}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}>
            <View
              style={{
                flex: 1,
                paddingRight: 6,
                justifyContent: "flex-end",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#FF6347" : "#FF4500",
                  }}>
                  -৳{formatFloat(Math.abs(item?.loss))}
                </Text>
              </View>
            </View>
            <View>
              <FontAwesome
                name="angle-right"
                size={24}
                color={isDark ? "#4A5568" : "#4A5568"}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
      {activeTab === "withdraw" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingVertical: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderColor: isDark ? "#202020" : "#F1F1F1",
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#919191" : "#919191",
                  }}>
                  {format(new Date(item?.createdAt), "dd MMM yyyy hh:mm a")}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}>
            <View
              style={{
                flex: 1,
                paddingRight: 6,
                justifyContent: "flex-end",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#FF6347" : "#0F0F0F",
                  }}>
                  -৳{formatFloat(Math.abs(item?.amount))}
                </Text>
              </View>
            </View>
            {/* <View>
              <FontAwesome
                name="angle-right"
                size={24}
                color={isDark ? "#4A5568" : "#4A5568"}
              />
            </View> */}
          </View>
        </View>
      )}
      {activeTab === "deposit" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingVertical: 16,
            borderBottomWidth: isLast ? 0 : 1,
            borderColor: isDark ? "#202020" : "#F1F1F1",
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#919191" : "#919191",
                  }}>
                  {format(new Date(item?.createdAt), "dd MMM yyyy hh:mm a")}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}>
            <View
              style={{
                flex: 1,
                paddingRight: 6,
                justifyContent: "flex-end",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: "medium",
                    color: isDark ? "#FFFFFF" : "#0F0F0F",
                  }}>
                  +৳{formatFloat(Math.abs(item?.amount))}
                </Text>
              </View>
            </View>
            {/* <View>
              <FontAwesome
                name="angle-right"
                size={24}
                color={isDark ? "#4A5568" : "#4A5568"}
              />
            </View> */}
          </View>
        </View>
      )}
    </Fragment>
  );
}
