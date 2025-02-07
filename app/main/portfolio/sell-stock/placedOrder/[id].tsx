import PlacedOrderSell from "@/components/portfolio/placedOrderSell";
import { SafeAreaView } from "@/components/Themed";
import React from "react";
import { ScrollView } from "react-native";

export default function PlacedOrderScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <PlacedOrderSell />
      </ScrollView>
    </SafeAreaView>
  );
}
