import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";

import {
  SafeAreaView,
  View as ThemedView,
  useThemeColor,
} from "@/components/Themed";
import useLang from "@/lib/hooks/useLang";
import { Button, Text } from "react-native-paper";
import { Stack, Link, useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { apiClient } from "@/lib/api";
import { useAuth } from "@clerk/clerk-expo";

export default function SupportScreen() {
  const { getToken } = useAuth();
  const langStore = useLang();
  const client = apiClient();
  const { language, setLanguage } = langStore;
  const isBn = language === "bn";
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "100%",
    },
  });

  const handelSubmit = async () => {
    if (!subject || !message) {
      return Alert.alert("Error", "Please fill all the fields");
    }
    try {
      setIsLoading(true);
      const token = await getToken();
      await client.post(
        "/auth/support/new",
        {
          subject,
          message,
        },
        token
      );
      setSubject("");
      setMessage("");
      router.push("/(start)/contact-success");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ gap: 8 }}>
          <TextInput
            value={subject}
            label="Subject"
            mode="outlined"
            left={<TextInput.Icon icon="book" />}
            onChangeText={(text) => setSubject(text)}
          />
          <TextInput
            value={message}
            label="Message (Max 1000 char)"
            mode="outlined"
            multiline={true}
            left={<TextInput.Icon icon="message" />}
            onChangeText={(text) => setMessage(text)}
            numberOfLines={Platform.OS === "ios" ? 0 : 8}
            //@ts-ignore
            minHeight={Platform.OS === "ios" ? 20 * 8 : 0}
          />
          <Button
            loading={isLoading}
            onPress={handelSubmit}
            style={{ borderRadius: 4, marginTop: 12 }}
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ flexDirection: "row-reverse", paddingVertical: 4 }}
            mode="contained">
            {isBn ? "সাবমিট" : "Submit"}
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
}
