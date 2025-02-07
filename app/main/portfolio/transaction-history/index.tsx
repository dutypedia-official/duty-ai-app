import TransactionTabContent from "@/components/portfolio/transactionTabContent";
import {
  notfoundPortfolio,
  notfoundPortfolioLight,
} from "@/components/svgs/notfound-portfolio";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { apiClientPortfolio } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

export default function TransactionHistory() {
  const { getToken } = useAuth();
  const clientPortfolio = apiClientPortfolio();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const [activeTab, setActiveTab] = useState("profit");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const translateX = useSharedValue(0);
  const [transactionsProfit, setTransactionsProfit] = useState<any>([]);
  const [transactionsLoss, setTransactionsLoss] = useState<any>([]);
  const [transactionsWithdraw, setTransactionsWithdraw] = useState<any>([]);
  const [transactionsDeposit, setTransactionsDeposit] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageProfit, setPageProfit] = useState(1);
  const [hasMoreProfit, setHasMoreProfit] = useState(true);
  const [pageLosses, setPageLosses] = useState(1);
  const [hasMoreLosses, setHasMoreLosses] = useState(true);
  const [pageWithdraw, setPageWithdraw] = useState(1);
  const [hasMoreWithdraw, setHasMoreWithdraw] = useState(true);
  const [pageDeposit, setPageDeposit] = useState(1);
  const [hasMoreDeposit, setHasMoreDeposit] = useState(true);

  const params = useLocalSearchParams<{
    perPage?: string;
  }>();
  const perPage = Number(params?.perPage) || 50;

  const fetchData = async () => {
    if (!hasMoreProfit) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/transactions/profit?page=${pageProfit}&perPage=${perPage}`,
        token
      );
      if (data?.transactions?.length > 0) {
        setPageProfit((prev) => prev + 1);
        setTransactionsProfit([...transactionsProfit, ...data?.transactions]);
      } else {
        setHasMoreProfit(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLossData = async () => {
    if (!hasMoreLosses) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();

      const { data } = await clientPortfolio.get(
        `/portfolio/get/transactions/loss?page=${pageLosses}&perPage=${perPage}`,
        token
      );

      if (data?.transactions?.length > 0) {
        setPageLosses((prev) => prev + 1);

        setTransactionsLoss([...transactionsLoss, ...data.transactions]);
      } else {
        setHasMoreLosses(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawData = async () => {
    if (!hasMoreWithdraw) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/withdraw?page=${pageWithdraw}&perPage=${perPage}`,
        token
      );
      if (data?.transactions?.length > 0) {
        setPageWithdraw((prev) => prev + 1);
        setTransactionsWithdraw([
          ...transactionsWithdraw,
          ...data?.transactions,
        ]);
      } else {
        setHasMoreWithdraw(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepositData = async () => {
    if (!hasMoreDeposit) {
      return;
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(
        `/portfolio/get/deposit?page=${pageDeposit}&perPage=${perPage}`,
        token
      );
      if (data?.transactions?.length > 0) {
        setPageDeposit((prev) => prev + 1);
        setTransactionsDeposit([...transactionsDeposit, ...data?.transactions]);
      } else {
        setHasMoreDeposit(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchLossData();
  }, []);

  useEffect(() => {
    fetchWithdrawData();
  }, []);

  useEffect(() => {
    fetchDepositData();
  }, []);

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
    },
    {
      tabName: isBn ? "লোকসান" : "Losses",
      value: "losses",
    },
    {
      tabName: isBn ? "উত্তোলন" : "Withdraw",
      value: "withdraw",
    },
    {
      tabName: isBn ? "জমা" : "Deposit",
      value: "deposit",
    },
  ];

  let data: {
    id: string;
    symbol?: string;
    amount: string;
    createdAt?: string;
  }[] = [];

  if (activeTab === "profit") data = transactionsProfit;
  else if (activeTab === "losses") data = transactionsLoss;
  else if (activeTab === "withdraw")
    data = transactionsWithdraw.map((item: any) => ({
      ...item,
      symbol: undefined,
    }));
  else if (activeTab === "deposit")
    data = transactionsDeposit.map((item: any) => ({
      ...item,
      symbol: undefined,
    }));

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
          All transaction history
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
              if (activeTab === "profit") {
                fetchData();
              } else if (activeTab === "losses") {
                fetchLossData();
              } else if (activeTab === "withdraw") {
                fetchWithdrawData();
              } else if (activeTab === "deposit") {
                fetchDepositData();
              }
            }}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 12,
            }}
            data={data}
            keyExtractor={(item) => item?.id}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: isDark ? "#262626" : "#F0F2F5",
                    padding: 4,
                    borderRadius: 8,
                    marginHorizontal: "auto",
                    width: "100%",
                  }}>
                  {tabs?.map((item, i) => {
                    const active = i === activeTabIndex;

                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          handleTabPress(i);
                          setActiveTab(item?.value);
                        }}
                        style={{
                          backgroundColor: active
                            ? isDark
                              ? "#FFFFFF"
                              : "#FFFFFF"
                            : "transparent",
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 4,
                          width: (Dimensions.get("window").width - 56) / 4,
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
              );
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{}}>
                  <TransactionTabContent
                    activeTab={activeTab}
                    isLast={index === data.length - 1}
                    item={item}
                  />
                </View>
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
                <>
                  {activeTab === "profit" && (
                    <ListEmpty
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
                    <ListEmpty
                      title={
                        isBn
                          ? "এখনো কোনো ক্ষতির রেকর্ড নেই।"
                          : "No losses recorded yet"
                      }
                      subTitle={
                        isBn
                          ? "আপনার বিনিয়োগ মনিটর করুন এবং ঝুঁকি কমানোর চেষ্টা করুন"
                          : "Monitor your investments to minimize risks"
                      }
                    />
                  )}
                  {activeTab === "withdraw" && (
                    <ListEmpty
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
                    <ListEmpty
                      title={
                        isBn ? "কোনো জমা পাওয়া যায়নি।" : "No deposits found"
                      }
                      subTitle={
                        isBn
                          ? " আপনার অ্যাকাউন্টে টাকা জমা দিন এবং বিনিয়োগ শুরু করুন।"
                          : "Deposit funds to your account and start investing"
                      }
                    />
                  )}
                </>
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
        {/* <SvgXml
          width={"100%"}
          xml={isDark ? notfoundPortfolio : notfoundPortfolioLight}
        /> */}

        <Image
          style={{ width: 100, height: 68 }}
          source={require("../../../../assets/images/notfoundPortfolio.png")}
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
