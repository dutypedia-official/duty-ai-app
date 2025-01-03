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
        name="index"
        options={{
          title: "Notification",
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#1E1E1E",
          },
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
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
    </Stack>
  );
}
