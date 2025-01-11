import { useThemeColor } from "@/components/Themed";
import useChat from "@/lib/hooks/useChat";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
// import * as ScreenOrientation from "expo-screen-orientation";
import { Pressable, useColorScheme } from "react-native";

export default function Layout() {
  const [isLandscape, setIsLandscape] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const { template } = useChat();
  // useEffect(() => {
  //   const subs = ScreenOrientation.addOrientationChangeListener((e) => {
  //     if (e.orientationInfo.orientation > 2) {
  //       setIsLandscape(true);
  //     } else {
  //       setIsLandscape(false);
  //     }
  //   });
  //   return () => {
  //     ScreenOrientation.removeOrientationChangeListener(subs);
  //   };
  // }, []);
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Discover", headerShown: false }}
      />

      <Stack.Screen name="finance" options={{ title: "Finance" }} />
      <Stack.Screen
        name="chart/index"
        options={{ title: "Stock List", headerShown: false }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title:
            template == "general"
              ? "Real Time Chat"
              : template == "finance"
              ? "Finance"
              : "Forex",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{ title: "History", headerShown: true }}
      />

      <Stack.Screen
        name="chart/details"
        options={{
          title: "Chart",
          headerShown: !isLandscape,
        }}
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

      <Stack.Screen
        name="scanner"
        options={{
          title: "scanner",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
