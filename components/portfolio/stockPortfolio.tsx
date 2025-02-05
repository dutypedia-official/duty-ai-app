import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import {
  notfoundPortfolio,
  notfoundPortfolioLight,
} from "../svgs/notfound-portfolio";
import PortfolioList from "./portfolioList";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useIsFocused } from "@react-navigation/native";
import { apiClientPortfolio } from "@/lib/api";

export default function StockPortfolio() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { freeBalance, refreash } = useUi();
  const { getToken } = useAuth();
  const isFocused = useIsFocused();
  const clientPortfolio = apiClientPortfolio();
  const [holdings, setHoldings] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const fetchData = async (init: boolean = true) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/holdings?page=${page}&perPage=${perPage}`,
        token
      );
      setHoldings(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreash]);

  return (
    <View>
      <View
        style={{
          marginHorizontal: 12,
          gap: 16,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              color: isDark ? "#FFFFFF" : "#1A202C",
            }}>
            {isBn ? "স্টক পোর্টফোলিও" : "Stock Portfolio"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/main/setting/stock-portfolio")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}>
            <Text
              style={{
                color: isDark ? "#FFFFFF" : "#1A202C",
              }}>
              {isBn ? "সব দেখুন" : "See all"}
            </Text>
            <FontAwesome name="angle-right" size={14} color={"#4A5568"} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            gap: 24,
          }}>
          {(holdings?.length || holdings?.items?.length) === 0 ? (
            <View
              style={{
                backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
                paddingHorizontal: 12,
                paddingVertical: 24,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: isDark ? "#262626" : "#E0E0E0",
                gap: 26,
                alignItems: "center",
                justifyContent: "center",
              }}>
              {/* <SvgXml
                width={"100%"}
                xml={isDark ? notfoundPortfolio : notfoundPortfolioLight}
              /> */}
              <Image
                style={{ width: 100, height: 68 }}
                source={require("../../assets/images/notfoundPortfolio.png")}
                resizeMode="contain"
              />
              <View
                style={{
                  width: 240,
                  paddingHorizontal: 6,
                }}>
                <Text
                  style={{
                    color: isDark ? "#FFFFFF" : "#34343F",
                    fontSize: 18,
                    fontWeight: "medium",
                    textAlign: "center",
                  }}>
                  {isBn ? "কোনো স্টক পাওয়া যায়নি।" : "No stock found"}
                </Text>
              </View>
              <View
                style={{
                  width: 240,
                  paddingHorizontal: 6,
                }}>
                <Text
                  style={{
                    color: isDark ? "#B0B0B0" : "#464665",
                    textAlign: "center",
                    fontSize: 14,
                  }}>
                  {isBn
                    ? "আপনি এখনো কোনো স্টক লেনদেন করেননি, নিচের বোতামে ক্লিক করে একটি স্টক কিনুন এবং আপনার যাত্রা শুরু করুন।"
                    : "You haven't made any stock transactions yet. Click the button below to buy a stock and start your journey."}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
                padding: 12,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: isDark ? "#262626" : "#E0E0E0",
                height: isLoading ? 355 : "auto",
              }}>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <ActivityIndicator />
                </View>
              ) : (
                holdings?.items?.map((item: any, i: number) => {
                  return (
                    <Fragment key={i}>
                      <PortfolioList
                        isLast={holdings?.items?.length - 1 === i}
                        item={item}
                      />
                    </Fragment>
                  );
                })
              )}
            </View>
          )}

          <TouchableOpacity
            disabled={parseFloat(freeBalance) === 0}
            onPress={() => {
              router.push("/main/setting/buy-stock");
            }}
            style={{
              width: "100%",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <LinearGradient
              colors={
                parseFloat(freeBalance) === 0
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
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color:
                    parseFloat(freeBalance) === 0
                      ? isDark
                        ? "#A0A0A0"
                        : "#666666"
                      : "#FFFFFF",
                  fontWeight: "bold",
                }}>
                {isBn ? "স্টক কিনুন" : "Buy Stock"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
