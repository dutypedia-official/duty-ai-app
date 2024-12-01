import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { SafeAreaView, View, useThemeColor } from "@/components/Themed";
import { Button, Divider, Text } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import useLang from "@/lib/hooks/useLang";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { apiClient } from "@/lib/api";
import axios from "axios";

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
  const isBn = language === "Bn";
  const isDark = useColorScheme() === "dark";
  const bgColor = useThemeColor({}, "background");
  const client = apiClient();

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
      title: isBn ? "ভাষা" : "Language",
      leftIcon: <Ionicons name="language" size={24} color={textColor} />,
      rightIcon: <Text>{!isBn ? "বাংলা" : "English"}</Text>,
      action: () => {
        setLanguage(language == "Bn" ? "En" : "Bn");
      },
    },
    // {
    //   title: isBn ? "ভাষা" : "Language and Translator",
    //   leftIcon: <Ionicons name="language" size={24} color={textColor} />,
    //   rightIcon: (
    //     <Ionicons name="chevron-forward" size={24} color={textColor} />
    //   ),
    //   action: () => {
    //     router.push("/main/setting/language");
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
        router.push("/main/setting/support");
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
        router.push("/main/setting/delete-account");
      },
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: bgColor }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: "transparent",
            paddingVertical: 40,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              flex: 1,
              backgroundColor: "transparent",
            }}
          >
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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flex: 1,
                    backgroundColor: "transparent",
                  }}
                >
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
          onPress={() => {
            signOut();
            router.replace("/(start)/login");
          }}
          icon="logout"
          textColor="red"
          style={{ borderRadius: 4, marginTop: 12, borderColor: "red" }}
          labelStyle={{ fontWeight: "bold" }}
          contentStyle={{ paddingVertical: 4 }}
          mode="outlined"
        >
          {isBn ? "লগউট" : "Logout"}
        </Button>
      </View>
    </ScrollView>
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
