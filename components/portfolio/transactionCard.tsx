import useLang from "@/lib/hooks/useLang";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TransactionEmpty from "./transactionEmpty";
import TransactionTabContent from "./transactionTabContent";
import { useAuth } from "@clerk/clerk-expo";
import { apiClientPortfolio } from "@/lib/api";
import { useIsFocused } from "@react-navigation/native";
import useUi from "@/lib/hooks/useUi";

export default function TransactionCard() {
  const { getToken } = useAuth();
  const clientPortfolio = apiClientPortfolio();
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const { refreash } = useUi();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const translateX = useSharedValue(0);
  const [transactionsProfit, setTransactionsProfit] = useState<any>([]);
  const [transactionsLoss, setTransactionsLoss] = useState<any>([]);
  const [transactionsWithdraw, setTransactionsWithdraw] = useState<any>([]);
  const [transactionsDeposit, setTransactionsDeposit] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams<{
    page?: string;
    perPage?: string;
  }>();

  const page = Number(params?.page) || 1;
  const perPage = Number(params?.perPage) || 5;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/transactions/profit?page=${page}&perPage=${perPage}`,
        token
      );

      setTransactionsProfit(data?.transactions);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLossData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/transactions/loss?page=${page}&perPage=${perPage}`,
        token
      );
      setTransactionsLoss(data?.transactions);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/withdraw?page=${page}&perPage=${perPage}`,
        token
      );
      setTransactionsWithdraw(data?.transactions);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepositData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/deposit?page=${page}&perPage=${perPage}`,
        token
      );

      setTransactionsDeposit(data?.transactions);
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

  useEffect(() => {
    fetchLossData();
  }, [refreash]);

  useEffect(() => {
    fetchWithdrawData();
  }, [refreash]);

  useEffect(() => {
    fetchDepositData();
  }, [refreash]);

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    translateX.value = withTiming(index * Dimensions.get("window").width, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -translateX.value }],
  }));

  const tabs = [
    {
      tabName: isBn ? "লাভ" : "Profit",
      value: "profit",
      data: transactionsProfit,
    },
    {
      tabName: isBn ? "লোকসান" : "Losses",
      value: "losses",
      data: transactionsLoss,
    },
    {
      tabName: isBn ? "উত্তোলন" : "Withdraw",
      value: "withdraw",
      data: transactionsWithdraw,
    },
    {
      tabName: isBn ? "জমা" : "Deposit",
      value: "deposit",
      data: transactionsDeposit,
    },
  ];

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
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: isDark ? "#FFFFFF" : "#1A202C",
            }}>
            {isBn ? "সকল লেনদেন" : "All transaction history"}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/main/setting/transaction-history")}
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
            backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
            padding: 12,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: isDark ? "#262626" : "#E0E0E0",
            // overflow: "hidden",
          }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? "#262626" : "#F0F2F5",
              padding: 4,
              borderRadius: 8,
            }}>
            {tabs?.map((item, i) => {
              const active = i === activeTabIndex;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleTabPress(i)}
                  style={{
                    backgroundColor: active
                      ? isDark
                        ? "#FFFFFF"
                        : "#FFFFFF"
                      : "transparent",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 4,
                    width: (Dimensions.get("window").width - 58) / 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: "center",
                      fontWeight: "medium",
                      color: active
                        ? isDark
                          ? "#000000"
                          : "#2D3748"
                        : isDark
                        ? "#718096"
                        : "#718096",
                    }}>
                    {item?.tabName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={{
              overflow: "hidden",
            }}>
            <Animated.View
              style={[
                {
                  width: Dimensions.get("screen").width * 4,
                  flexDirection: "row",
                },
                animatedStyle,
              ]}>
              {tabs?.map((tabData, i) => {
                const activeTab = tabData?.value;

                return (
                  <View
                    key={i}
                    style={{
                      width: Dimensions.get("screen").width,
                      flex: 1,
                      marginRight: 50,
                    }}>
                    {tabData?.data?.length === 0 ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        {activeTab === "profit" && (
                          <TransactionEmpty
                            title={
                              isBn
                                ? "এখনো কোনো লাভের রেকর্ড নেই।"
                                : "No profits recorded yet"
                            }
                            subTitle={
                              isBn
                                ? "বুদ্ধিমানের সাথে বিনিয়োগ করুন এবং এখানে আপনার লাভ দেখুন"
                                : "Invest smartly to see your profits grow here."
                            }
                          />
                        )}
                        {activeTab === "losses" && (
                          <TransactionEmpty
                            title={
                              isBn
                                ? "এখনো কোনো ক্ষতির রেকর্ড নেই।"
                                : "No losses recorded yet"
                            }
                            subTitle={
                              isBn
                                ? "Monitor your investments to minimize risks"
                                : "আপনার বিনিয়োগ মনিটর করুন এবং ঝুঁকি কমানোর চেষ্টা করুন"
                            }
                          />
                        )}
                        {activeTab === "withdraw" && (
                          <TransactionEmpty
                            title={
                              isBn
                                ? "এখনো কোনো উত্তোলন করা হয়নি।"
                                : "No withdrawals made yet"
                            }
                            subTitle={
                              isBn
                                ? "ট্রেডিং শুরু করতে আপনার অ্যাকাউন্টে টাকা যোগ করুন।"
                                : "Add funds to your account to start trading"
                            }
                          />
                        )}
                        {activeTab === "deposit" && (
                          <TransactionEmpty
                            title={
                              isBn
                                ? "কোনো জমা পাওয়া যায়নি।"
                                : "No deposits found"
                            }
                            subTitle={
                              isBn
                                ? " আপনার অ্যাকাউন্টে টাকা জমা দিন এবং বিনিয়োগ শুরু করুন।"
                                : "Deposit funds to your account and start investing"
                            }
                          />
                        )}
                      </View>
                    ) : (
                      tabData?.data?.map((item: any, id: number) => {
                        return (
                          <Fragment key={id}>
                            <TransactionTabContent
                              activeTab={activeTab}
                              isLast={tabData?.data.length - 1 === id}
                              item={item}
                            />
                          </Fragment>
                        );
                      })
                    )}
                  </View>
                );
              })}
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}
