import { View, Text, ScrollView } from "react-native";
import React from "react";
import TransactionItemDetails from "@/components/portfolio/transactionItemDetails";
import { SafeAreaView } from "@/components/Themed";

export default function TransactionItemDetailsScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <TransactionItemDetails />
      </ScrollView>
    </SafeAreaView>
  );
}
