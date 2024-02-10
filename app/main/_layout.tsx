import IonIcon from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import useLang from "@/lib/hooks/useLang";
import { BlurView } from "expo-blur";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof IonIcon>["name"];
  color: string;
}) {
  return <IonIcon size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        tabBarHideOnKeyboard: Platform.OS === "ios" ? false : true,
        // tabBarStyle: { position: "absolute" },
        // tabBarBackground: () => (
        //   <BlurView
        //     intensity={100}
        //     tint={colorScheme === "dark" ? "dark" : "light"}
        //     style={StyleSheet.absoluteFill}
        //   />
        // ),
      }}
    >
      {/* <Tabs.Screen
        name="chat"
        options={{
          title: isBn ? "চ্যাট" : "Chat",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-chatbubble-ellipses-outline" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="index"
        options={{
          title: isBn ? "চ্যাট" : "Chat",
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: isBn ? "ইতিহাস" : "History",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-time-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: isBn ? "সেটিং" : "Setting",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
