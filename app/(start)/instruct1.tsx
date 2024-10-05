import { StyleSheet, Image, View, Dimensions, ScrollView } from "react-native";

import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DummyChat from "@/components/onboarding/DummyChat";

export default function Ins1Screen() {
  const langStore = useLang();
  const { language } = langStore;
  const isBn = language === "Bn";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Instruction",
        }}
      />
      <View style={styles.container}>
        <Image
          style={styles.bgImage}
          resizeMode="contain"
          source={require("../../assets/icons/logo.png")}
        />
        <ScrollView contentContainerStyle={{ gap: 48 }}>
          <DummyChat
            title={isBn ? "📚 শিক্ষা" : "📚 Education"}
            subTitle={
              isBn
                ? `. যেকোনো বড় লেখা সংক্ষিপ্ত করুন
. একটি সুন্দর আবেদন তৈরি করুন`
                : `. Summarize Your Text
. Write a Winning Application`
            }
            direction="left"
          />
          <DummyChat
            title={isBn ? "💼 চাকুরী" : "💼 Work"}
            subTitle={
              isBn ? "একটি শক্তিশালী সিবি তৈরি করুন" : `Craft a Winning Resume`
            }
            direction="right"
          />

          <DummyChat
            title={isBn ? "🍿 বিনোদন" : "🍿 Entertainment"}
            subTitle={
              isBn
                ? `ভাল মুভি,গান,ওয়েব সিরিজ এবং মজার বিনোদন সাজেস্ট নিন`
                : `Recommendations for Movies, Series, Songs, and More`
            }
            direction="left"
          />
        </ScrollView>
        <View style={{ zIndex: 10, position: "relative", gap: 12 }}>
          <Text style={styles.title}>
            {isBn ? (
              "আপনার AI-কে যেকোনো বিষয়ে জিজ্ঞাসা করুন"
            ) : (
              <>
                Ask your{" "}
                <Text
                  style={{ fontWeight: "bold", color: "rgb(105, 220, 163)" }}
                >
                  AI
                </Text>{" "}
                about anything
              </>
            )}
          </Text>

          <Link href="/instruct2" asChild>
            <Button
              style={{ borderRadius: 100 }}
              icon="chevron-right"
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{
                flexDirection: "row-reverse",
                paddingVertical: 6,
              }}
              mode="contained"
            >
              {isBn ? "পরবর্তী" : "Next"}
            </Button>
          </Link>
        </View>
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
