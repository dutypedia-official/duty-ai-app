import { StyleSheet, Image, View } from "react-native";

import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DummyChat from "@/components/onboarding/DummyChat";

export default function Ins2Screen() {
  const langStore = useLang();
  const { language } = langStore;
  const isBn = language === "Bn";
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Instruction",
        }}
      />
      <Image
        style={styles.bgImage}
        resizeMode="contain"
        source={require("../../assets/icons/logo.png")}
      />
      <View style={{ gap: 48 }}>
        <DummyChat
          title={isBn ? "🕰️ উন্নতি" : "🕰️ Productivity"}
          subTitle={
            isBn
              ? `. টাইম ম্যানেজমেন্ট হ্যাক করুন
. লক্ষ্য এবং গোল নির্ধারণ করুন`
              : `. Time Management Hacks
. Goal Setting and Achievement`
          }
          direction="left"
        />
        <DummyChat
          title={isBn ? "🈲 ভাষা" : "🈲 Language"}
          subTitle={isBn ? `নতুন ভাষা আয়ত্ত করুন` : `Master a New Language`}
          direction="right"
        />
        <DummyChat
          title="💬 Bangla & English"
          subTitle={
            isBn
              ? `সঠিক বাংলা এবং ইংরেজি ভাষায় প্রশ্ন এবং উত্তর নিন`
              : `Chat AI with Accurate Bangla and English Language`
          }
          direction="left"
        />
      </View>
      <View style={{ zIndex: 10, position: "relative", gap: 12 }}>
        <Text style={styles.title}>
          {isBn ? (
            "এখনই শুরু করে আপনার AI এর সাথে কথা বলুন ৷"
          ) : (
            <>
              “Get start” now and talk with your{" "}
              <Text style={{ fontWeight: "bold", color: "rgb(105, 220, 163)" }}>
                AI
              </Text>{" "}
            </>
          )}
        </Text>

        <Link href="/login" asChild>
          <Button
            style={{ borderRadius: 100 }}
            icon="chevron-right"
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{ flexDirection: "row-reverse", paddingVertical: 6 }}
            mode="contained"
          >
            {isBn ? "শুরু করুন" : "Get Started"}
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    resizeMode: "contain",
    position: "relative",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  bgImage: {
    height: 250,
    width: 250,
    position: "absolute",
    opacity: 0.1,
    bottom: "25%",
    alignSelf: "center",
  },
});
