import { SafeAreaView } from "@/components/Themed";
import ConfirmSellStock from "@/components/portfolio/confirmSellStock";
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
        <ConfirmSellStock />
      </ScrollView>
    </SafeAreaView>
  );
}
