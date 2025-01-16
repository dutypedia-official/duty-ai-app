import { Text, View, useThemeColor } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import useStockData from "@/lib/hooks/useStockData";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import Toast from "react-native-toast-message";
import BottomSheet from "@gorhom/bottom-sheet";
import SheetCardIos from "@/components/SheetCardios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StockListItem } from "@/components/chart/StockListItem";
import { useIsFocused } from "@react-navigation/native";

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

const StockListScreen = () => {
  const inset = useSafeAreaInsets();
  const { language } = useLang();
  const isBn = language === "bn";
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

  const isDark = useColorScheme() === "dark";
  const textColor = useThemeColor({}, "text");
  const { favorites, setFavorites, stockName } = useStockData();

  const [marketData, setMarketData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
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
  const [isLoading2, setIsLoading2] = useState(true);
  let initialStocks = !activeFilter
    ? marketData
    : marketData.filter((stock: any) => stock[activeFilter] == true) || [];
  const bgColor = useThemeColor({}, "background");

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

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const token = await getToken();
      const { data: mData } = await client.get(
        "/tools/get-stock-market",
        null,
        {},
        mainServerAvailable
      );
      const { data } = await client.get("/tools/get-favs", token);
      const { data: alermData } = await client.get("/noti/get-alerms", token);

      setMarketData(mData);
      setAlerms(alermData?.alerms);
      setFavorites(data);
      setAiAlerms(alermData?.aiAlerms);
      console.log(alermData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreash]);

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

  const ListHeaderComponent = React.useMemo(() => {
    return (
      <View
        style={{
          zIndex: 9,
          backgroundColor: bgColor,
          paddingTop: inset.top,
        }}>
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
                keyboardType="default"
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
            paddingLeft: 12,
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
      </View>
    );
  }, [searchTerm, activeFilter]);

  // Avoid unnecessary re-renders by memoizing the renderItem
  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <View
          style={{
            backgroundColor: bgColor,
            paddingHorizontal: 12,
          }}>
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
        </View>
      );
    },
    [alerms, aiAlerms, favorites, refreash, refreashFav]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}>
      <StatusBar translucent={true} />

      <FlatList
        data={filteredStocks}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={() => {
          return loadingData ? (
            <View
              style={{
                flex: 1,
                height: Dimensions.get("screen").height - inset.top - 200,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
              }}>
              <ActivityIndicator
                size="small"
                color={isDark ? "#00B0FF" : "#34495E"}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                height: Dimensions.get("screen").height - inset.top - 200,
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ color: textColor, fontSize: 16 }}>
                {isBn ? "কোনো স্টক পাওয়া যায়নি" : "No stock found"}
              </Text>
            </View>
          );
        }}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.symbol}
        // style={styles.list}
        refreshControl={
          <RefreshControl refreshing={screenRefresh} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.5}
        // ListFooterComponent={() => {
        //   if (initialStocks.length > 0) {
        //     return (
        //       <View
        //         style={{
        //           paddingVertical: 16,
        //           justifyContent: "center",
        //           alignItems: "center",
        //         }}>
        //         <ActivityIndicator
        //           size="small"
        //           color={isDark ? "#00B0FF" : "#34495E"}
        //         />
        //       </View>
        //     );
        //   }
        //   return null;
        // }}
      />
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
    </KeyboardAvoidingView>
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

export default StockListScreen;
