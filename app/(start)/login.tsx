import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  useColorScheme,
} from "react-native";

import {
  SafeAreaView,
  Text,
  useThemeColor,
  View,
} from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { useState } from "react";
import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}
export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { getToken } = useAuth();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const isDark = colorScheme === "dark";
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  const [visible, setVisible] = useState(false);
  const bgColor = useThemeColor({}, "background");

  const injectedJavaScript = `
  document.getElementsByTagName('video')[0].play();
  var iframe = document.querySelector('iframe');
  iframe.requestFullscreen();
`;

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/main");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerShown: true,
          title: isBn ? "লগইন" : "Login",
          headerStyle: {
            backgroundColor: bgColor,
          },
        }}
      />
      <View />

      <View style={{ alignItems: "center", gap: 20 }}>
        <Image
          style={{ height: 150, width: 150, marginBottom: 24 }}
          resizeMode="contain"
          source={require("../../assets/icons/logo.png")}
        />
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}>
          <Image
            style={{ height: 40, width: 40 }}
            resizeMode="contain"
            source={require("../../assets/icons/google.png")}
          />
          <Text style={{ color: "black", fontWeight: "700" }}>
            {isBn ? "গুগল দিয়ে লগইন করুন" : "Login with Google"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}>
          <FontAwesome
            style={{ paddingLeft: 20 }}
            name="apple"
            size={30}
            color="#000"
          />
          <Text style={{ color: "black", fontWeight: "700", paddingLeft: 8 }}>
            {isBn ? "অ্যাপল দিয়ে লগইন করুন" : "Login with Apple"}
          </Text>
        </TouchableOpacity>
        {Platform.OS === "android" && (
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginTop: 10,
            }}>
            <Text style={{ fontWeight: "bold" }}>
              লগইন করতে সমস্যা হলে ভিডিও টি দেখুন
            </Text>
            <Text>
              <Ionicons name="play-circle" size={24} />
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={
            {
              // paddingHorizontal: 12,
            }
          }>
          <View
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height * 0.85,
              backgroundColor: isDark ? "black" : "white",
            }}>
            {loading && (
              <View
                style={
                  {
                    // width: Dimensions.get("window").width - 24,
                    // height: Dimensions.get("window").width / videoAspectRatio,
                  }
                }>
                <ActivityIndicator
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </View>
            )}
            <WebView
              style={{
                height: Dimensions.get("window").width,
                flex: 1,
                backgroundColor: isDark ? "black" : "white",
              }}
              onLoadStart={() => setLoading(true)}
              onLoad={() => setLoading(false)}
              onLoadEnd={() => setLoading(false)}
              onError={() => setLoading(false)}
              javaScriptEnabled={true}
              allowsFullscreenVideo={true}
              source={{
                uri: "https://www.youtube.com/embed/lNYaw_Cjnso",
              }}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
              injectedJavaScript={injectedJavaScript}
              onMessage={(event) => {
                if (
                  Platform.OS === "android" &&
                  event.nativeEvent.data === "enterFullScreen"
                ) {
                  setVisible(false);
                  setTimeout(() => setVisible(true), 0);
                }
              }}
            />
          </View>
        </Modal>
      </Portal>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Link href="/contact" asChild>
          <Button mode="text" icon="phone" labelStyle={{ fontWeight: "bold" }}>
            {isBn ? "যোগাযোগ করুন" : "Contact us"}
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  btnOutline: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f3f3",
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
