import { SplashScreen, Stack, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Setting", headerShown: false }}
      />
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
    </Stack>
  );
}
