import { ScrollView, StyleSheet } from "react-native";

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
import { TouchableOpacity } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";

export default function LanguageScreen() {
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
      title: isBn ? "ভাষা" : "App Language",
      leftIcon: <Ionicons name="language" size={24} color={textColor} />,
      rightIcon: <Text>{!isBn ? "বাংলা" : "English"}</Text>,
      action: () => {
        setLanguage(language == "bn" ? "en" : "bn");
      },
    },
    {
      title: isBn ? "অনুবাদক" : "Translator",
      leftIcon: <Ionicons name="help-buoy" size={24} color={textColor} />,
      rightIcon: (
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      ),
      action: () => {
        router.push("/main/setting/translator");
      },
    },
  ];

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          {generalSettings.map((setting, i) => (
            <TouchableOpacity onPress={setting.action} key={i}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flex: 1,
                  }}>
                  {/* {setting.leftIcon} */}

                  <Text numberOfLines={1}>{setting.title}</Text>
                </View>
                {setting.rightIcon}
              </View>
              <Divider />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
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
