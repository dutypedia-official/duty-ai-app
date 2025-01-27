import { SafeAreaView } from "@/components/Themed";
import SellStock from "@/components/portfolio/sell-stock";
import React from "react";

export default function PortfolioStockDetailsScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <SellStock />
    </SafeAreaView>
  );
}
