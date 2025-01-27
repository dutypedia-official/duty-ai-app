import React from "react";
import { ScrollView, View } from "react-native";
import AssetsBalCard from "./assetsBalCard";
import StockPortfolio from "./stockPortfolio";
import TransactionCard from "./transactionCard";
import { SafeAreaView } from "@/components/Themed";

export default function Portfolio() {
  const withdrawBalance = "4570";
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            gap: 20,
            paddingBottom: 24,
          }}>
          <AssetsBalCard withdrawBalance={withdrawBalance} />
          <StockPortfolio withdrawBalance={withdrawBalance} />
          <TransactionCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
