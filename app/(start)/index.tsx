import { StyleSheet, Image } from "react-native";

import { SafeAreaView, View } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { SegmentedButtons, Text } from "react-native-paper";

export default function StartScreen() {
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Start",
        }}
      />
      <Text style={styles.title}>
        {isBn
          ? "আপনার AI এর জগতে আপনাকে স্বাগতম 🌎"
          : "Welcome to your AI world 🌎"}
      </Text>

      <View style={{ alignItems: "center" }}>
        <Image
          style={{ height: 150, width: 150 }}
          resizeMode="contain"
          source={require("../../assets/icons/logo.png")}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            paddingVertical: 30,
            height: 90,
          }}
        >
          {isBn ? "ভাষা নির্বাচন করুন" : "Select Language"}
        </Text>
        <SegmentedButtons
          value={language}
          onValueChange={(value: any) => setLanguage(value)}
          buttons={[
            {
              value: "En",
              label: "English",
            },
            {
              value: "Bn",
              label: "বাংলা",
            },
          ]}
        />
      </View>
      <Link href="/instruct1" asChild>
        <Button
          style={{ borderRadius: 100 }}
          icon="chevron-right"
          labelStyle={{ fontWeight: "bold" }}
          contentStyle={{ flexDirection: "row-reverse", paddingVertical: 6 }}
          mode="contained"
        >
          {isBn ? "পরবর্তী" : "Next"}
        </Button>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    height: 120,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
