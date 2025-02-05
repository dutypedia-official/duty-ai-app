import PortfolioList from "@/components/portfolio/portfolioList";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { apiClientPortfolio } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StockPortfolio() {
  const { getToken } = useAuth();
  const clientPortfolio = apiClientPortfolio();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const isFocused = useIsFocused();
  const [holdings, setHoldings] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    if (!hasMore || isLoading) return; // Prevent unnecessary API calls

    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/holdings?page=${page}&perPage=${perPage}`,
        token
      );

      if (data?.items?.length > 0) {
        setHoldings((prev: any) => [...prev, ...data.items]); // Append new items
        console.log(data?.items[0]);
        setPage((prev) => prev + 1); // Move to next page
      } else {
        setHasMore(false); // Stop pagination when no more data
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? bgColor : "#fff",
      }}>
      <StatusBar backgroundColor={isDark ? bgColor : "#FFFFFF"} />
      <View
        style={{
          position: "absolute",
          zIndex: 999,
          paddingTop: insets.top + 24,
          paddingBottom: 24,
          backgroundColor: isDark ? bgColor : "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          gap: 25,
        }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 50,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            width: 32,
            height: 32,
          }}>
          <Text>
            <Ionicons
              name="chevron-back"
              size={20}
              style={{ color: "#311919" }}
            />
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: !isDark ? "#000" : "#fff",
          }}>
          Stock Portfolio
        </Text>
        <View style={{ backgroundColor: "transparent", width: 32 }}></View>
      </View>

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark ? bgColor : "#fff",
        }}>
        <View
          style={{
            marginTop: 84,
            marginHorizontal: 12,
            marginBottom: 24,
            backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
            borderRadius: 16,
            flexGrow: 1,
          }}>
          <FlatList
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              fetchData();
            }}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 12,
            }}
            data={holdings}
            keyExtractor={(item) => item?.id}
            renderItem={({ item, index }) => {
              return (
                <PortfolioList
                  isLast={holdings?.length - 1 === index}
                  item={item}
                />
              );
            }}
            ListEmptyComponent={() => {
              return isLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    height:
                      Dimensions.get("screen").height -
                      insets.top -
                      insets.bottom -
                      200,
                  }}>
                  <ActivityIndicator />
                </View>
              ) : (
                <ListEmpty
                  title={isBn ? "কোনো স্টক পাওয়া যায়নি।" : "No stock found"}
                  subTitle={
                    isBn
                      ? "আপনি এখনো কোনো স্টক লেনদেন করেননি, নিচের বোতামে ক্লিক করে একটি স্টক কিনুন এবং আপনার যাত্রা শুরু করুন।"
                      : "You haven't made any stock transactions yet. Click the button below to buy a stock and start your journey."
                  }
                />
              );
            }}
            // ListFooterComponent={() => {
            //   return isLoading && <ActivityIndicator />;
            // }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

export const ListEmpty = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
        height:
          Dimensions.get("screen").height - insets.top - insets.bottom - 200,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingVertical: 24,
          borderRadius: 16,
          gap: 26,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Image
          style={{ width: 100, height: 68 }}
          source={require("../../../assets//images/notfoundPortfolio.png")}
          resizeMode="contain"
        />
        <View
          style={{
            width: 240,
            marginHorizontal: "auto",
            gap: 26,
          }}>
          <Text
            style={{
              color: isDark ? "#FFFFFF" : "#34343F",
              fontSize: 18,
              fontWeight: "medium",
              textAlign: "center",
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: isDark ? "#B0B0B0" : "#464665",
              textAlign: "center",
              fontSize: 14,
            }}>
            {subTitle}
          </Text>
        </View>
      </View>
    </View>
  );
};
