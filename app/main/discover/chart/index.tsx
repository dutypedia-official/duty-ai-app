import { SafeAreaView, Text, View, useThemeColor } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useLang from "@/lib/hooks/useLang";
import useStockData from "@/lib/hooks/useStockData";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import {
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from "react-native";

import { ActivityIndicator, Button, Modal, Portal } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import Toast from "react-native-toast-message";
import { BlurView } from "expo-blur";
import MagicIcon from "@/components/svgs/magic";
import { LinearGradient } from "expo-linear-gradient";
import MagicInactiveDark from "@/components/svgs/magicInactiveDark";
import MagicInactiveLight from "@/components/svgs/magicInactiveLight";
import { date } from "zod";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SheetCard from "@/components/SheetCard";
import BottomSheet from "@gorhom/bottom-sheet";
import SheetCardIos from "@/components/SheetCardios";

export const getPrice = (item: any) => {
  //Check if the time is between 10 am to 2pm
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const time = hour + minute / 60;
  const isMarketOpen = time >= 10 && time <= 14;
  if (isMarketOpen) {
    if (item?.ltp && item?.ltp !== "0") {
      return item?.ltp;
    } else {
      return item?.close;
    }
  }

  if (item?.close && item?.close !== "0") {
    return item?.close;
  } else {
    return item?.ltp;
  }
};

const filteredItems = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Top gainers",
    value: "topGainer",
  },
  {
    name: "Biggest losers",
    value: "biggestLosers",
  },
  {
    name: "Most active",
    value: "mostActive",
  },
  {
    name: "Best performing",
    value: "bestPerforming",
  },
];

export const StockListItem = ({
  name,
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
  const isPositivePer = !changePer?.startsWith("-");
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
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

  const isFav = favs?.find((fav: any) => fav.symbol === name);

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
        "/tools/fav-symbol",
        {
          symbol: name,
          price,
          currency: "BDT",
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
      name: "Vol ",
      value: volume,
    },
    {
      name: "Value",
      value: value,
    },
    {
      name: "Trade",
      value: trading,
    },
  ];

  useEffect(() => {
    if (Array.isArray(alerms)) {
      const cAlarm = alerms?.find((a: any) => a.symbol == name);
      setCurrentAlarm(cAlarm);
    }
    if (Array.isArray(aiAlerms)) {
      const cAiAlerm = aiAlerms?.find((a: any) => a.symbol == name);
      setCurrentAiAlarm(cAiAlerm);
    }
  }, [alerms, aiAlerms]);

  return (
    <View>
      {/* <Portal>
        <Modal visible={visible} onDismiss={hideModal} dismissable={false}>
          <View
            style={{
              padding: 20,
              margin: 40,
              borderRadius: 8,
              position: "relative",
            }}>
            <TouchableOpacity
              onPress={hideModal}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
              }}>
              <Text>
                <Entypo name="circle-with-cross" size={24} />
              </Text>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 32,
                borderWidth: 1,
                backgroundColor: lf6f6f6,
                borderRadius: 8,
                borderColor: borderColor,
              }}>
              <TextInput
                maxLength={8}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  textAlign: "center",
                  color: textColor,
                }}
                placeholder="00:00"
                placeholderTextColor="#888"
                value={targetPrice}
                onChangeText={(text) =>
                  setTargetPrice(text.replace(/[^0-9.]/g, ""))
                }
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              disabled={
                loading ||
                parseFloat(targetPrice) < 1 ||
                parseFloat(targetPrice) == currentAlarm?.price
              }
              onPress={handelSetAlerm}
              style={{
                marginTop: 20,
                marginBottom: 10,
                backgroundColor:
                  parseFloat(targetPrice) > 0 &&
                  parseFloat(targetPrice) != currentAlarm?.price
                    ? "#152f4a"
                    : "#9ca7b1",
                borderRadius: 8,
                padding: 16,
              }}>
              <Text style={{ textAlign: "center", color: "white" }}>
                {loading ? "Please wait..." : "Set Alarm"}
              </Text>
            </TouchableOpacity>

            {currentAlarm && (
              <TouchableOpacity
                onPress={handelDeleteAlerm}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: "#e74c3c",
                  borderRadius: 8,
                  padding: 16,
                }}>
                <Text style={{ textAlign: "center", color: "white" }}>
                  {loading ? "Please wait..." : "Delete Alarm"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </Portal> */}
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
            <View style={{ backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }}>
              <Text
                style={{
                  color: "#00B0FF",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
                numberOfLines={1}
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
                ৳ {price}
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
            <View
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
                {change + "%"}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                borderRadius: 4,
                gap: 4,
                backgroundColor: isPositivePer ? "#2ECC71" : "#CE1300",
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
                {changePer + "%"}
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
                  `https://www.tradingview.com/chart/?symbol=DSEBD:${name}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=DSEBD:${name}&theme=${colorScheme}`,
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
                Chart
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
                setSelectedAlarmShit(currentAlarm);
                setSelectedStock({
                  name,
                  price,
                  value,
                  change,
                  logoUrl,
                  volume,
                  changePer,
                });
                setCompanyName(name);

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
                {currentAlarm || currentAiAlarm ? "Edit Alerm" : "Set Alarm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTemplate("finance");
                setActiveConversationId(null);
                setPrompt(`DSEBD:${name} bangladesh`);
                router.push({
                  pathname: "/main/discover/chat",
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
                Ask AI
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const StockListScreen = () => {
  const { language } = useLang();
  const isBn = language === "Bn";
  const [sortByName, setSortByName] = useState(false);
  const {
    refreash,
    setRefreash,
    screenRefresh,
    setScreenRefresh,
    mainServerAvailable,
    setRefreashFav,
    refreashFav,
    selectedStock,
    selectedAlarmShit,
  } = useUi();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading2, setIsLoading2] = useState(true);

  const isDark = useColorScheme() === "dark";
  const textColor = useThemeColor({}, "text");
  const { marketData, setMarketData, favorites, setFavorites, stockName } =
    useStockData();

  const [activeFilter, setActiveFilter] = useState("topGainer");
  const [alerms, setAlerms] = useState([]);
  const [aiAlerms, setAiAlerms] = useState([]);
  const [activeTab, setActiveTab] = useState("priceAlarm");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const client = apiClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingDeleteAlarm, setLoadingDeleteAlarm] = useState(false);
  const [loadingAiAlarm, setLoadingAiAlarm] = useState(false);
  const [loadingDeleteAiAlarm, setLoadingDeleteAiAlarm] = useState(false);
  let initialStocks = !activeFilter
    ? marketData
    : marketData.filter((stock: any) => stock[activeFilter] == true) || [];
  const le5e5e5 = useThemeColor({}, "le5e5e5");
  const lf6f6f6 = useThemeColor({}, "lf6f6f6");
  const borderColor = useThemeColor({}, "border");
  // Filter stocks based on the search term
  let filteredStocks = initialStocks?.filter((stock: any) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortByName) {
    filteredStocks = filteredStocks.sort(
      (a: { symbol: string }, b: { symbol: any }) =>
        a.symbol.localeCompare(b.symbol)
    );
  }

  const fetchAlerms = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/noti/get-alerms",
        token,
        {},
        mainServerAvailable
      );

      setAlerms(data?.alerms);
      setAiAlerms(data?.aiAlerms);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const fetchFavs = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/tools/get-favs",
        token,
        {},
        mainServerAvailable
      );
      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const { data: mData } = await client.get(
        "/tools/get-stock-market",
        null,
        {},
        mainServerAvailable
      );
      setMarketData(mData);
    } catch (error) {
      console.log(error);
    }
  };

  const handelSetAlerm = async () => {
    if (!selectedStock) {
      return Toast.show({
        type: "error",
        text1: "Select a stock first!",
      });
    }
    try {
      setLoading(true);
      const token = await getToken();
      if (+selectedStock?.price?.replace(",", "") === parseFloat(targetPrice)) {
        return Toast.show({
          type: "error",
          text1: "Price is same as current price!",
        });
      }
      await client.post(
        "/noti/create-alerm",
        {
          price: parseFloat(targetPrice),
          symbol: selectedStock?.name,
          condition:
            parseFloat(targetPrice) > +selectedStock?.price?.replace(",", "")
              ? "Up"
              : "Down",
        },
        token,
        {},
        mainServerAvailable
      );

      Toast.show({
        type: "success",
        text1: "Alarm set successfully",
      });

      setRefreash(!refreash);
      setRefreashFav(!refreashFav);

      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelSetAiAlerm = async () => {
    if (!selectedStock) {
      return Toast.show({
        type: "error",
        text1: "Select a stock first!",
      });
    }
    try {
      setError(null);
      setLoadingAiAlarm(true);
      const token = await getToken();
      await client.post(
        "/noti/create-ai-alerm",
        {
          symbol: selectedStock?.name,
          prompt: inputText,
        },
        token,
        mainServerAvailable
      );

      Toast.show({
        type: "success",
        text1: "Alarm set successfully",
      });

      setRefreash(!refreash);
      setRefreashFav(!refreashFav);

      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error: any) {
      console.log(error.response?.data);
      setError(error.response?.data?.detail);
    } finally {
      setLoadingAiAlarm(false);
    }
  };

  const handelDeleteAlerm = async () => {
    try {
      setLoadingDeleteAlarm(true);
      const token = await getToken();
      await client.delete(
        `/noti/delete-alerm/${currentAlarm.id}`,
        token,
        {},
        mainServerAvailable
      );
      Toast.show({
        type: "success",
        text1: "Alarm deleted successfully",
      });
      setRefreash(!refreash);
      setRefreashFav(!refreashFav);
      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error deleting alarm",
      });
    } finally {
      setLoadingDeleteAlarm(false);
    }
  };
  const handelDeleteAiAlerm = async () => {
    try {
      setLoadingDeleteAiAlarm(true);
      const token = await getToken();
      await client.delete(
        `/noti/delete-ai-alerm/${selectedStock.name}`,
        token,
        {},
        mainServerAvailable
      );
      Toast.show({
        type: "success",
        text1: "Alarm deleted successfully",
      });
      setRefreash(!refreash);
      setRefreashFav(!refreashFav);
      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error deleting alarm",
      });
    } finally {
      setLoadingDeleteAiAlarm(false);
    }
  };

  useEffect(() => {
    fetchAlerms();
  }, [refreash]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchFavs();
    }, 600000); // 600000 ms = 10 minutes
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 600000); // 600000 ms = 10 minutes
    return () => clearInterval(intervalId);
  }, []);

  const onRefresh = useCallback(() => {
    setScreenRefresh(true);
    setTimeout(() => {
      setScreenRefresh(false);
    }, 2000);
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [companyName, setCompanyName] = useState(null);
  const currentAlarm: any = alerms?.find(
    (alerm: any) => alerm.symbol === companyName
  );
  const currentAiAlerm: any = aiAlerms?.find(
    (alerm: any) => alerm.symbol === companyName
  );

  const [targetPrice, setTargetPrice] = useState(
    currentAlarm ? `${currentAlarm?.price}` : ""
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}>
            <Text>
              <Ionicons
                name="chevron-back"
                size={24}
                style={{ color: isDark ? "#00B0FF" : "#34495E" }}
              />
            </Text>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#00B0FF" : "#2980B9" },
              ]}>
              {isBn ? "স্টক লিস্ট" : "Stock List"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}>
            <View
              style={[
                styles.searchContainer,
                { borderColor: isDark ? "#333333" : "#D1D1D1" },
              ]}>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: textColor,
                  height: "100%",
                  paddingLeft: 12, // 12-pixel gap from the left border
                  paddingVertical: 0,
                }}
                placeholder="Search stock"
                placeholderTextColor={isDark ? "#fff" : "#34495E"}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              <Feather
                name="search"
                size={20}
                color={isDark ? "#333333" : "#34495E"}
                style={styles.searchIcon}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setSortByName(!sortByName);
              }}>
              <FontAwesome
                name="sort-alpha-asc"
                size={24}
                color={sortByName ? "#00B0FF" : isDark ? "#a1a1a1" : "#909090"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{
            flexGrow: 0,
            flexShrink: 0,
            paddingVertical: 12,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-start",
            alignSelf: "flex-start",
            gap: 12,
          }}>
          {filteredItems.map((item: any, index) => (
            <TouchableOpacity
              onPress={() => {
                setActiveFilter(item.value);
              }}
              key={index}
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? "#333333" : "#B0BEC5",
                backgroundColor:
                  activeFilter != item.value
                    ? isDark
                      ? "#1C1C1C"
                      : "#E0E0E0"
                    : "#00796B",
              }}>
              <Text
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  color:
                    activeFilter != item.value
                      ? isDark
                        ? "#B0BEC5"
                        : "#fff"
                      : "white",
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredStocks}
          renderItem={({ item }) => (
            <StockListItem
              changePer={item.changePer}
              name={item.symbol}
              price={getPrice(item)}
              change={item.change}
              logoUrl={`https://s3-api.bayah.app/cdn/symbol/logo/${item.symbol}.svg`}
              volume={item.volume}
              value={item.value}
              alerms={alerms}
              aiAlerms={aiAlerms}
              favs={favorites}
              trading={item.trade}
              targetPrice={targetPrice}
              setCompanyName={setCompanyName}
              item={item}
              bottomSheetRef={bottomSheetRef}
            />
          )}
          keyExtractor={(item) => item.symbol}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={screenRefresh} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>

      {Platform.OS === "ios" ? (
        <SheetCardIos
          bottomSheetRef={bottomSheetRef}
          currentAlarm={currentAlarm}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          textColor={textColor}
          targetPrice={targetPrice}
          setTargetPrice={setTargetPrice}
          inputText={inputText}
          currentAiAlerm={currentAiAlerm}
          setInputText={setInputText}
          error={error}
          handelSetAlerm={handelSetAlerm}
          loading={loading}
          loadingDeleteAlarm={loadingDeleteAlarm}
          loadingAiAlarm={loadingAiAlarm}
          loadingDeleteAiAlarm={loadingDeleteAiAlarm}
          handelDeleteAlerm={handelDeleteAlerm}
          handelSetAiAlerm={handelSetAiAlerm}
          handelDeleteAiAlerm={handelDeleteAiAlerm}
        />
      ) : (
        <SheetCard
          bottomSheetRef={bottomSheetRef}
          currentAlarm={currentAlarm}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          textColor={textColor}
          targetPrice={targetPrice}
          setTargetPrice={setTargetPrice}
          inputText={inputText}
          currentAiAlerm={currentAiAlerm}
          setInputText={setInputText}
          error={error}
          handelSetAlerm={handelSetAlerm}
          loading={loading}
          loadingDeleteAlarm={loadingDeleteAlarm}
          loadingAiAlarm={loadingAiAlarm}
          loadingDeleteAiAlarm={loadingDeleteAiAlarm}
          handelDeleteAlerm={handelDeleteAlerm}
          handelSetAiAlerm={handelSetAiAlerm}
          handelDeleteAiAlerm={handelDeleteAiAlerm}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align items to both ends
    paddingVertical: 10,
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

export default StockListScreen;
