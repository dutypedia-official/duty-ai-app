import { SafeAreaView } from "@/components/Themed";
import { apiClientPortfolio } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import React, { useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AssetsBalCard from "./assetsBalCard";
import StockPortfolio from "./stockPortfolio";
import TransactionCard from "./transactionCard";
import useSocket from "@/lib/hooks/useSocket";

export default function Portfolio() {
  const { getToken } = useAuth();
  const { socket } = useSocket();
  const clientPortfolio = apiClientPortfolio();
  const {
    setBalance,
    setFreeBalance,
    setTotalInvestment,
    setTotalCurrentMarketValue,
    setTotalBrokerFee,
    setIsLoading,
    refreash,
    setRefreash,
    setResetPortfolioDrop,
  } = useUi();

  const fetchData = async (init: boolean = true) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await clientPortfolio.get(`/portfolio/get`, token);
      console.log("data-portfolio-------------", JSON.stringify(data));
      setTotalInvestment(data?.totalInvestment);
      setTotalBrokerFee(data?.totalBrokerFee);
      setBalance(data?.portfolio?.balance);
      setFreeBalance(data?.portfolio?.free);
      setTotalCurrentMarketValue(data?.totalCurrentMarketValue);
      setIsLoading(false);
      console.log(data?.portfolio?.free, "-----fffuck");
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
    if (socket) {
      socket.on(`portfolio-update`, () => {
        console.log("New portfolio update...");
        setRefreash(!refreash);
      });
    }
    return () => {
      if (socket) {
        socket.off(`portfolio-update`);
      }
    };
  }, [socket]);

  return (
    <SafeAreaView>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => setResetPortfolioDrop(false)}>
          <View
            style={{
              gap: 20,
              paddingBottom: 24,
            }}>
            <AssetsBalCard />
            <StockPortfolio />
            <TransactionCard />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}
