import { SafeAreaView } from "@/components/Themed";
import { apiClientPortfolio } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import AssetsBalCard from "./assetsBalCard";
import StockPortfolio from "./stockPortfolio";
import TransactionCard from "./transactionCard";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import useUi from "@/lib/hooks/useUi";

export default function Portfolio() {
  const { getToken } = useAuth();
  const isFocused = useIsFocused();
  const clientPortfolio = apiClientPortfolio();
  const {
    setBalance,
    setFreeBalance,
    setTotalInvestment,
    setHoldings,
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
      // setHoldings(data?.portfolio?.holdings);
      setFreeBalance(data?.portfolio?.free);

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
