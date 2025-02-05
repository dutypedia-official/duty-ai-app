import { useThemeColor } from "@/components/Themed";
import usePortfolio from "@/lib/hooks/usePortfolio";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const { isPortfolio } = usePortfolio();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
        },
      }}
    >
      {/* <Stack.Screen name="index" options={{ title: "Setting" }} /> */}

      {isPortfolio ? (
        <Stack.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="welcome-portfolio"
          options={{
            title: "Welcome Portfolio",
            headerShown: false,
          }}
        />
      )}

      <Stack.Screen
        name="delete-account"
        options={{ title: "Delete Account" }}
      />
      <Stack.Screen name="support" options={{ title: "Support" }} />
      <Stack.Screen
        name="language"
        options={{ title: "Language & Translator" }}
      />
      <Stack.Screen name="translator" options={{ title: "Translator" }} />
      <Stack.Screen
        name="translate-to"
        options={{ title: "Select Language" }}
      />
      <Stack.Screen
        name="select-language"
        options={{ title: "Select Language" }}
      />
      <Stack.Screen
        name="change-market"
        options={{
          title: "Change Market",
          headerShown: false,
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1E1E1E",
          },
        }}
      />

      <Stack.Screen
        name="update-setting"
        options={{
          title: "",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="recharge"
        options={{
          title: "Recharge",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="recharge-history"
        options={{
          title: "Recharge History",
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
    </Stack>
  );
}
