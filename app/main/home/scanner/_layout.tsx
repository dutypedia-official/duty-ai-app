import { useThemeColor } from "@/components/Themed";
import useChat from "@/lib/hooks/useChat";
import { useIsFocused } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
// import * as ScreenOrientation from "expo-screen-orientation";
import { Pressable, useColorScheme } from "react-native";

export default function Layout() {
  const [isLandscape, setIsLandscape] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const { setTemplate, template } = useChat();
  const pathname = usePathname();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (template !== "scanner") {
      setTemplate("scanner");
    }
  }, [isFocused]);

  console.log(pathname, "template", template);

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
          title: "scanner",
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "scanner",
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="limit"
        options={{
          title: "Limit",
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
