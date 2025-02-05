import { SafeAreaView } from "@/components/Themed";
import { apiClientPortfolio } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import AssetsBalCard from "./assetsBalCard";
import StockPortfolio from "./stockPortfolio";
import TransactionCard from "./transactionCard";

export default function Portfolio() {
  const { getToken } = useAuth();
  const clientPortfolio = apiClientPortfolio();
  const {
    setBalance,
    setFreeBalance,
    setTotalInvestment,
    setTotalCurrentMarketValue,
    setIsLoading,
    refreash,
  } = useUi();

  const fetchDataFeed = async (init: boolean = true) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(`/portfolio/get`, token);
      setTotalInvestment(data?.totalInvestment);
      setBalance(data?.portfolio?.balance);
      setFreeBalance(data?.portfolio?.free);
      setTotalCurrentMarketValue(data?.totalCurrentMarketValue);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFeed();
  }, [refreash]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            gap: 20,
            paddingBottom: 24,
          }}>
          <AssetsBalCard />
          <StockPortfolio />
          <TransactionCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
