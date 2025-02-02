import { SplashScreen, Stack, useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Chat", headerShown: false }}
      />
      <Stack.Screen
        name="scanner"
        options={{ headerShown: false, title: "Back" }}
      />
      <Stack.Screen
        name="vipsignal"
        options={{
          title: "Select 3 stock",
          headerShown: false,
          headerTitleStyle: {
            color: isDark ? "#FFD700" : "#366000",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#000306",
        }}
      />
    </Stack>
  );
}
