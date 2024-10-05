import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { SegmentedButtons, Text } from "react-native-paper";
import { SafeAreaView, View } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";

export default function StartScreen() {
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const videoRef = useRef<any>(null);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}>
      <StatusBar style="light" />
      <Video
        ref={videoRef}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          backgroundColor: isDark ? "#06112D" : "#FFFFFF",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        source={require("../../assets/video/background.mp4")}
        shouldPlay={true}
        isLooping={false}
        //@ts-ignore
        resizeMode={"cover"}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Start",
          }}
        />
        <Text style={styles.title}>
          {isBn
            ? "ট্রেডিং এর জগতে আপনাকে স্বাগতম 🌎"
            : "Welcome to your trading world 🌎"}
        </Text>

        <View style={{ alignItems: "center", backgroundColor: "transparent" }}>
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
              color: "#fff",
            }}>
            {isBn ? "ভাষা নির্বাচন করুন" : "Select Language"}
          </Text>
          <SegmentedButtons
            value={language}
            onValueChange={(value: any) => setLanguage(value)}
            buttons={[
              {
                value: "En",
                label: "English",
                labelStyle: { color: "#fff" },
                style: language === "En" ? { backgroundColor: "#06112d" } : {},
              },
              {
                value: "Bn",
                label: "বাংলা",
                labelStyle: { color: "#fff" },
                style: language === "Bn" ? { backgroundColor: "#06112d" } : {},
              },
            ]}
          />
        </View>
        <Pressable onPress={() => router.push("/instruct2")}>
          <LinearGradient
            colors={["#FF6FD8", "#00FFC6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 2,
              borderRadius: 100,
              opacity: 1,
            }}>
            <LinearGradient
              colors={["#FF6FD8", "#973FCD", "#3813C2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ borderRadius: 100, opacity: 0.8 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingVertical: 16,
                  textAlign: "center",
                  color: "#FFD700",
                }}>
                {isBn ? "পরবর্তী" : "Next"}
              </Text>
            </LinearGradient>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    height: 120,
    color: "#fff",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
