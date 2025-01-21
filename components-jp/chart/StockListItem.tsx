import { Text, useThemeColor, View } from "@/components-jp/Themed";
import { apiClient } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useStockData from "@/lib/hooks/useStockData";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { SvgUri } from "react-native-svg";

export const StockListItem = ({
  name,
  shortCode,
  price,
  value,
  change,
  logoUrl,
  volume,
  alerms,
  aiAlerms,
  changePer,
  favs,
  onFavList = false,
  trading,
  targetPrice,
  setCompanyName,
  item,
  bottomSheetRef,
}: any) => {
  const isPositive = !change?.startsWith("-");
  const colorScheme = useColorScheme();
  const changeColor = isPositive
    ? colorScheme == "dark"
      ? "#58FF54"
      : "#44da00"
    : "#FE003D";
  const isDark = colorScheme === "dark";
  const lf6f6f6 = useThemeColor({}, "lf6f6f6");
  const borderColor = useThemeColor({}, "border");
  const l004662 = useThemeColor({}, "l004662");
  const router = useRouter();
  const [currentAlarm, setCurrentAlarm] = useState<any>(null);
  const [currentAiAlarm, setCurrentAiAlarm] = useState<any>(null);
  const {
    setRefreashFav,
    refreashFav,
    refreash,
    setRefreash,
    mainServerAvailable,
    selectedStock,
    setSelectedStock,
    selectedAlarmShit,
    setSelectedAlarmShit,
  } = useUi();
  const textColor = useThemeColor({}, "text");
  const { setTemplate, setActiveConversationId, setPrompt, setSubmitPrompt } =
    useChat();
  const { getToken } = useAuth();
  const client = apiClient();

  const isFav = favs?.find((fav: any) => fav.symbol === item?.name);

  // const [targetPrice, setTargetPrice] = useState(
  //   currentAlarm ? `${currentAlarm.price}` : ""
  // );

  const { setStockName } = useStockData();
  const [isFavorite, setIsFavorite] = useState(
    onFavList ? true : isFav ? true : false
  );
  const isPositiveBtn = !trading?.startsWith("-");

  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      const token = await getToken();

      const response = await client.post(
        `/tools/fav-symbol?country=JP`,
        {
          symbol: item?.name,
          price,
          currency: "JPY",
          trading: "10.12",
          change,
          logo: logoUrl,
          volume,
        },
        token,
        {},
        mainServerAvailable
      );
      setRefreashFav(!refreashFav);
      console.log(response.data);
    } catch (error) {
    } finally {
    }

    // Optionally, you can add logic to update the favorite status in your backend or state management
  };

  const infoData = [
    {
      name: "出来高",
      value: volume,
    },
  ];

  useEffect(() => {
    if (Array.isArray(alerms)) {
      const cAlarm = alerms?.find((a: any) => a.symbol == item?.name);
      setCurrentAlarm(cAlarm);
    }
    if (Array.isArray(aiAlerms)) {
      const cAiAlerm = aiAlerms?.find((a: any) => a.symbol == item?.name);
      setCurrentAiAlarm(cAiAlerm);
    }
  }, [alerms, aiAlerms]);

  return (
    <View>
      <View
        style={{
          flexDirection: "column",
          backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
          padding: 12,
          borderRadius: 12,
          marginVertical: 10,
          gap: 12,
        }}>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
              flexDirection: "row",
              gap: 8,
            }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 100,
                overflow: "hidden",
                backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                position: "relative",
              }}>
              <View
                style={{
                  width: 24,
                  height: 24,
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
                  {name?.[0]}
                </Text>
              </View>
              {logoUrl && <SvgUri uri={logoUrl} width={24} height={24} />}
            </View>
            <View
              style={{
                backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                flex: 1,
              }}>
              <Text
                style={{
                  color: "#00B0FF",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
                numberOfLines={2}
                ellipsizeMode="tail">
                {name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
            }}>
            <TouchableOpacity onPress={toggleFavorite}>
              {isFavorite ? (
                <AntDesign name="heart" size={20} color="#FF0000" />
              ) : (
                <AntDesign name="hearto" size={20} color="#FF0000" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}>
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              gap: 12,
            }}>
            <View style={{ backgroundColor: "transparent" }}>
              <Text
                style={{
                  color: isDark ? "#FFFFFF" : "#000000",
                  fontSize: 14,
                  fontWeight: "800",
                }}>
                ¥ {price}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "center",
              }}>
              {infoData?.map((info: any, idx: number) => {
                return (
                  <Fragment key={idx}>
                    <View
                      style={{
                        width: "33.33%",
                        backgroundColor: "transparent",
                        flexDirection: "column",
                        alignItems: idx === 0 ? "flex-start" : "center",
                        justifyContent: "flex-start",
                        gap: 4,
                      }}>
                      <Text
                        style={{
                          color: isDark ? "#FFFFFF" : "#000000",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}>
                        {info?.name}
                      </Text>

                      <Text
                        style={{
                          color: isDark ? "#FFFFFF" : "#000000",
                          fontSize: 10,
                        }}>
                        {info?.value}
                      </Text>
                    </View>

                    {idx !== infoData?.length - 1 && (
                      <View
                        style={{
                          width: 1,
                          backgroundColor: "#555555",
                          paddingVertical: 8,
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </View>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: 80,
            }}>
            {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "transparent",
                }}>
                <AntDesign
                  style={{ color: changeColor, paddingTop: 6 }}
                  name={isPositive ? "caretup" : "caretdown"}
                  size={14}
                />
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: "right",
                    color: changeColor,
                  }}>
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(change)) + "%"}
                </Text>
              </View> */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
                gap: 4,
                backgroundColor: isPositive ? "#2ECC2E" : "#CE1300",
                borderColor: isDark ? "#333333" : "#EAEDED",
                width: 56,
                justifyContent: "center",
              }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  textAlign: "center",
                }}>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(change)) + "%"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.itemButtonsContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              backgroundColor: "transparent",
              width: "100%",
            }}>
            <TouchableOpacity
              onPress={() => {
                // router.push({
                //   pathname: "/main/discover/chart/details",
                //   params: { symbol: name },
                // });
                WebBrowser.openBrowserAsync(
                  `https://www.tradingview.com/chart/?symbol=TSE:${item?.name}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=TSE:${item?.name}&theme=${colorScheme}`,
                  {
                    showTitle: false,
                    enableBarCollapsing: false,
                  }
                );
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
                gap: 4,
                backgroundColor: isDark ? "#333333" : "#EAEDED",
                borderColor: isDark ? "#333333" : "#EAEDED",
              }}>
              <Text>
                <MaterialIcons
                  name="show-chart"
                  size={14}
                  color={isDark ? "#ffffff" : "#5188D4"}
                />
              </Text>
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 12 }}>
                チャート
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
                gap: 4,
                backgroundColor: isDark ? "#333333" : "#EAEDED",
                borderColor: isDark ? "#333333" : "#EAEDED",
              }}
              onPress={() => {
                console.log(shortCode);

                setSelectedAlarmShit(currentAlarm);
                setSelectedStock({
                  shortCode,
                  item,
                  price,
                  value,
                  change,
                  logoUrl,
                  volume,
                  changePer,
                });
                setCompanyName(shortCode);

                // global
                bottomSheetRef.current?.expand();
              }}>
              <Text style={{ color: "white" }}>
                {currentAlarm || currentAiAlarm ? (
                  <MaterialIcons
                    color="#CE1300"
                    name="edit-notifications"
                    size={14}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={"bell-plus"}
                    size={14}
                    color={isDark ? "#ffffff" : "#5188D4"}
                  />
                )}
              </Text>
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 12 }}>
                {currentAlarm || currentAiAlarm
                  ? "アラーム編集"
                  : "アラーム設定"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTemplate("finance");
                setActiveConversationId(null);
                setPrompt(`TSE:${name} JAPAN`);
                router.push({
                  pathname: "/main-jp/discover/chat",
                  params: { fromPath: "list" },
                });
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
                gap: 4,
                backgroundColor: isDark ? "#333333" : "#EAEDED",
                borderColor: isDark ? "#333333" : "#EAEDED",
              }}>
              <Text style={{ color: "white" }}>
                <FontAwesome
                  name="magic"
                  size={14}
                  color={isDark ? "#5188D4" : "#5188D4"}
                />
              </Text>
              <Text
                style={{ color: isDark ? "#FFFFFF" : "#000000", fontSize: 12 }}>
                AIに質問
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align items to both ends
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 20,
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 12, // 12-pixel gap between the back button and the text
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 50,
    height: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "white", // Change text color to white
    height: "100%",
    paddingLeft: 12, // 12-pixel gap from the left border
    paddingVertical: 0,
  },
  searchIcon: {
    marginLeft: 8,
    width: 20,
    height: 20,
    marginRight: 12, // 12-pixel gap from the right border
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#010912",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#161616",
    borderRadius: 8,
    marginVertical: 4, // 8-pixel gap between cards (4 pixels top + 4 pixels bottom)
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logo: {
    width: 20,
    height: 20,
    borderRadius: 10, // 50% of width/height to make it circular
    marginRight: 4, // 4-pixel gap between logo and text
  },
  itemTextContainer: {
    marginLeft: 10,
    gap: 4,
    backgroundColor: "transparent",
    maxWidth: 200, // Ensure proper truncation
  },
  itemName: {
    color: "#87CEEB",
    fontSize: 14,
    lineHeight: 18,
  },
  changeLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  priceChangeContainer: {
    paddingRight: 4,
    backgroundColor: "transparent",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },
  itemChange: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  arrowIcon: {
    marginLeft: 4, // Ensures space between text and arrow icon
  },
  itemButtonsContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 16,
  },
  askAIButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginLeft: 0,
  },
  askAIButtonText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  chartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1D21",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    height: 32, // Set height to 32 pixels
    marginLeft: 12, // Gap of 12 pixels from the card border on the left side
    marginRight: 0, // No margin on the right side
  },
  alarmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1D21",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    height: 32, // Set height to 32 pixels
    marginLeft: 12, // Gap of 12 pixels from the card border on the left side
    marginRight: 0, // No margin on the right side
  },
  chartButtonText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
});
