import { SafeAreaView } from "@/components/Themed";
import PlacedOrderBuy from "@/components/portfolio/placedOrderBuy";
import React from "react";
import { ScrollView } from "react-native";

export default function ConfirmScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <PlacedOrderBuy />
      </ScrollView>
    </SafeAreaView>
  );
}
