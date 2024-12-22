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
import { Switch } from "react-native-paper";
import { Checkbox } from "react-native-paper";

const languages = [
  { name: "Arabic", value: "ar" },
  { name: "Chinese", value: "zh" },
  { name: "English", value: "en" },
  { name: "Bengali", value: "bn" },
  { name: "French", value: "fr" },
  { name: "German", value: "de" },
  { name: "Portuguese (Brazil)", value: "pt" },
  { name: "Filipino", value: "fil" },
  { name: "Hindi", value: "hi" },
  { name: "Italian", value: "it" },
  { name: "Japanese", value: "ja" },
  { name: "Tamil", value: "ta" },
  { name: "Urdu", value: "ur" },
];

export default function TranslatorScreen() {
  const { signOut, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const langStore = useLang();
  const {
    language,
    autoTranslateTo,
    setAutoTranslateTo,
    isTranslate,
    setIsTranslate,
  } = langStore;
  const isBn = language === "Bn";

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          {languages.map((lang, i) => (
            <TouchableOpacity
              onPress={() => setAutoTranslateTo(lang.value)}
              key={i}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flex: 1,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "600" }}
                    numberOfLines={1}
                  >
                    {lang.name}
                  </Text>
                </View>
                {autoTranslateTo === lang.value && (
                  <Checkbox status="checked" />
                )}
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
