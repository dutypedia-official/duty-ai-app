import {
  ActivityIndicator,
  GestureResponderEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { SafeAreaView, View, useThemeColor } from "@/components/Themed";
import { Button, Divider, Text } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import useLang from "@/lib/hooks/useLang";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { apiClient } from "@/lib/api";
import axios from "axios";
import useMarket from "@/lib/hooks/useMarket";
import { SvgXml } from "react-native-svg";
import { globe_change_dark } from "@/components/svgs/globe_change_dark";
import { globe_change } from "@/components/svgs/globe_change";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingScreen() {
  const { signOut, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const langStore = useLang();
  const { language, setLanguage, setAutoTranslateTo } = langStore;
  const isBn = language === "bn";
  const { setSelectMarket } = useMarket();
  const isDark = useColorScheme() === "dark";
  const bgColor = useThemeColor({}, "background");
  const client = apiClient();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  // Helper function to create a delay using a Promise
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handlePress = async (event: GestureResponderEvent): Promise<void> => {
    setIsLoading(true); // Start loading
    await delay(3000); // Wait for 3 seconds
    await signOut();
    setLanguage("en");
    setSelectMarket("");
    setIsLoading(false); // Stop loading
    router.replace("/(start)"); // Perform the navigation
  };

  console.log("path---------", path);
  const test = async () => {
    const token = await getToken();
    console.log(token);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  const generalSettings = [
    {
      title: language === "ja" ? "言語" : isBn ? "ভাষা" : "Language",
      leftIcon: <Ionicons name="language" size={24} color={textColor} />,
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        router.push("/main/home/setting/select-language");
      },
    },
    {
      title: isBn ? "বাজার পরিবর্তন" : "Change Market",
      leftIcon: (
        <SvgXml
          xml={!isDark ? globe_change_dark : globe_change}
          width={24}
          height={24}
        />
      ),
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        router.push("/main/home/setting/change-market");
      },
    },

    // {
    //   title: isBn ? "ভাষা" : "Language and Translator",
    //   leftIcon: <Ionicons name="language" size={24} color={textColor} />,
    //   rightIcon: (
    //     <Ionicons name="chevron-forward" size={24} color={textColor} />
    //   ),
    //   action: () => {
    //     router.push("/main/home/setting/language");
    //   },
    // },
    {
      title: isBn ? "শর্তাবলি" : "Terms",
      leftIcon: <Ionicons name="reader-outline" size={24} color={textColor} />,
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        WebBrowser.openBrowserAsync(
          "https://www.dutyai.app/legal/terms-and-conditions",
          {
            showTitle: false,
            toolbarColor: "#6200EE",
            enableBarCollapsing: false,
          }
        );
      },
    },
    {
      title: isBn ? "গোপনীয়তা নীতি" : "Privacy policy",
      leftIcon: (
        <Ionicons name="shield-checkmark" size={24} color={textColor} />
      ),
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        WebBrowser.openBrowserAsync(
          "https://www.dutyai.app/legal/privacy-policy"
        );
      },
    },
    {
      title: isBn ? "সাপোর্ট" : "Support",
      leftIcon: <Ionicons name="help-buoy" size={24} color={textColor} />,
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        router.push("/main/home/setting/support");
      },
    },
    {
      title: isBn
        ? "আমার অ্যাকাউন্ট ডিলিট করে দিন"
        : "Delete my account and data",
      leftIcon: <Ionicons name="trash-outline" size={24} color={textColor} />,
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        router.push("/main/home/setting/delete-account");
      },
    },
  ];

  return (
    <View
      style={{
        backgroundColor: isDark ? bgColor : "#fff",
        paddingTop: insets.top,
        flex: 1,
      }}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 12,
          paddingHorizontal: 12,
          backgroundColor: isDark ? bgColor : "#fff",
          borderBottomWidth: 1,
          borderColor: isDark ? "#1D1E1D" : "rgba(64, 73, 67,0.12)",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 80,
          }}>
          <Ionicons
            name="chevron-back"
            size={24}
            style={{ color: isDark ? "#0B84FF" : "#007AFF" }}
          />
          <Text
            style={{
              textAlign: "left",
              fontSize: 18,
              fontWeight: "600",
              color: isDark ? "#0B84FF" : "#007AFF",
            }}>
            Chat
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: "transparent",
          }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "semibold",
              color: isDark ? "#fff" : "#000",
            }}>
            Setting
          </Text>
        </View>
        <View
          style={{
            width: 80,
            backgroundColor: "transparent",
          }}></View>
      </View>
      <ScrollView style={{ backgroundColor: bgColor }}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: "transparent",
              paddingVertical: 40,
            },
          ]}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent",
            }}>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                flex: 1,
                backgroundColor: "transparent",
              }}>
              <Avatar.Image
                size={48}
                source={{ uri: user?.imageUrl }}
                style={{ backgroundColor: "transparent" }}
              />
              <View style={{ backgroundColor: "transparent" }}>
                <Text numberOfLines={1} variant="titleMedium">
                  {firstName} {lastName}
                </Text>
                <Text numberOfLines={1}>{email}</Text>
              </View>
            </View>
            {/* <AntDesign name="edit" size={24} color={textColor} /> */}
          </View>

          <View style={{ backgroundColor: "transparent" }}>
            <Text variant="titleSmall" style={{ marginBottom: 8 }}>
              {isBn ? "সাধারণ" : "General"}
            </Text>
            {generalSettings.map((setting, i) => (
              <TouchableOpacity onPress={setting.action} key={i}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    backgroundColor: "transparent",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      flex: 1,
                      backgroundColor: "transparent",
                    }}>
                    {setting.leftIcon}

                    <Text numberOfLines={1}>{setting.title}</Text>
                  </View>
                  {setting.rightIcon}
                </View>
                <Divider />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            onPress={handlePress}
            icon={isLoading ? "" : "logout"}
            textColor="red"
            style={{ borderRadius: 4, marginTop: 12, borderColor: "red" }}
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ paddingVertical: 4 }}
            mode="outlined">
            {isLoading ? <ActivityIndicator /> : isBn ? "লগউট" : "Logout"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
