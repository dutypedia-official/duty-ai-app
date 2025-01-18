import React from "react";
import { ScrollView, View } from "react-native";
import AssetsBalCard from "./assetsBalCard";
import StockPortfolio from "./stockPortfolio";
import TransactionCard from "./transactionCard";

export default function Portfolio() {
  return (
    <ScrollView>
      <View
        style={{
          gap: 20,
          paddingVertical: 24,
        }}>
        <AssetsBalCard />
        <StockPortfolio />
        <TransactionCard />
      </View>
    </ScrollView>
  );
}
