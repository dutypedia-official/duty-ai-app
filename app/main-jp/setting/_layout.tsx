import { useThemeColor } from "@/components/Themed";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
        },
        headerTitleStyle: {
          color: isDark ? "#FFFFFF" : "#1E1E1E",
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "設定",
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1E1E1E",
          },
        }}
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
        options={{
          title: "Select Language",
        }}
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
        name="terms"
        options={{
          title: "Change Market Terms",
          headerShown: false,
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1E1E1E",
          },
        }}
      />
    </Stack>
  );
}
