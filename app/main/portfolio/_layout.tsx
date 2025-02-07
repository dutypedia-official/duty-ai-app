import { useThemeColor } from "@/components/Themed";
import useUi from "@/lib/hooks/useUi";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const { portfolioStatus } = useUi();

  console.log("portfolio status--------", portfolioStatus);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
        },
      }}
      initialRouteName={!portfolioStatus ? "welcome-portfolio" : "index"}>
      <Stack.Screen
        name="welcome-portfolio"
        options={{
          title: "Welcome Portfolio",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Portfolio",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="transaction-history/index"
        options={{
          title: "All transaction history",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="transaction-history/[id]"
        options={{
          title: "Transaction Details",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buy-stock/index"
        options={{
          title: "Buy Stock List",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buy-stock/[id]"
        options={{
          title: "Buy Stock",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buy-stock/confirm/[id]"
        options={{
          title: "Sell Stock",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buy-stock/placedOrder/[id]"
        options={{
          title: "Placed Order",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="sell-stock/[id]"
        options={{
          title: "Sell Stock",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sell-stock/sell-stock-form/[id]"
        options={{
          title: "Sell Stock Form",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sell-stock/placedOrder/[id]"
        options={{
          title: "Placed Order",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="stock-portfolio"
        options={{
          title: "Stock Portfolio",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: "chat",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
