import { useThemeColor } from "@/components/Themed";
import { Stack } from "expo-router";
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
      }}>
      <Stack.Screen
        name="list/index"
        options={{
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1E1E1E",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#000306",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="list/processing"
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: "Processing",
          headerTitleStyle: {
            color: isDark ? "#FFD700" : "#8B7500",
            fontSize: 24,
            fontWeight: "700",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#000306",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="list/win"
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: "Win",
          headerTitleStyle: {
            color: isDark ? "#FFD700" : "#8B7500",
            fontSize: 24,
            fontWeight: "700",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#000306",
          headerStyle: {
            backgroundColor: bgColor,
          },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="list/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
