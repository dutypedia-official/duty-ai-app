import {
  StyleSheet,
  Image,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";

import {
  SafeAreaView,
  View as ThemedView,
  useThemeColor,
} from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Button, Text } from "react-native-paper";
import { Stack, Link, useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ContactScreen() {
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  const [text, setText] = useState("");
  const headerHeight = useHeaderHeight();
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      minHeight: Dimensions.get("window").height - headerHeight,
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "100%",
    },
  });

  const handelSubmit = () => {
    router.push("/(start)/contact-success");
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: isBn ? "কন্টাক্ট" : "Contact",
        }}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ gap: 8 }}>
          <TextInput
            label="Name"
            mode="outlined"
            left={<TextInput.Icon icon="face-man" />}
            onChangeText={(text) => setText(text)}
          />
          <TextInput
            label="Email (Optional)"
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            onChangeText={(text) => setText(text)}
          />
          <TextInput
            label="Phone"
            mode="outlined"
            keyboardType="decimal-pad"
            left={<TextInput.Icon icon="phone" />}
            onChangeText={(text) => setText(text)}
          />
          <TextInput
            label="Message (Max 1000 char)"
            mode="outlined"
            multiline={true}
            left={<TextInput.Icon icon="message" />}
            onChangeText={(text) => setText(text)}
            numberOfLines={Platform.OS === "ios" ? 0 : 8}
            //@ts-ignore
            minHeight={Platform.OS === "ios" ? 20 * 8 : 0}
          />
          <Button
            onPress={handelSubmit}
            style={{ borderRadius: 4, marginTop: 12 }}
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ flexDirection: "row-reverse", paddingVertical: 4 }}
            mode="contained"
          >
            {isBn ? "সাবমিট" : "Submit"}
          </Button>
          <ThemedView
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View style={{ paddingBottom: 24 }}>
            <Text variant="headlineSmall">Office Location</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <MaterialCommunityIcons
                name="office-building-marker"
                size={24}
                color={textColor}
              />
              <Text style={{ paddingRight: 36 }}>
                Road, Rupali, Bandar, Narayanganaj, Dhaka, Bangladesh
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
}
