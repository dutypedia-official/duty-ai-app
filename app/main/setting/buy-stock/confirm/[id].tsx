import { SafeAreaView } from "@/components/Themed";
import ConfirmBuyStock from "@/components/portfolio/confirmBuyStock";
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
        <ConfirmBuyStock />
      </ScrollView>
    </SafeAreaView>
  );
}
