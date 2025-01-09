import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  useColorScheme,
  Pressable,
} from "react-native";

import { SafeAreaView, Text, useThemeColor, View } from "@/components/Themed";
import useLang from "@/lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { Fragment, useState } from "react";
import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import * as WebBrowser from "expo-web-browser";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}
export default function Login() {
  const insets = useSafeAreaInsets();
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
  const isBn = language === "bn";
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
        router.replace("/main-jp/home");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      <LinearGradient
        colors={["#4A148C", "#2A2B2A"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar style="light" />
        <Stack.Screen
          options={{
            headerShown: false,
            title: isBn ? "লগইন" : "Login",
            headerStyle: {
              backgroundColor: bgColor,
            },
          }}
        />
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
        <View
          style={{
            // paddingTop: insets.top,
            backgroundColor: "transparent",
            marginLeft: 20,
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={
              {
                //   position: "absolute",
              }
            }>
            <LinearGradient
              colors={["#6A4E9D", "#8E44AD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                width: 36,
                height: 36,
              }}>
              <Text>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ color: "#FFFFFF" }}
                />
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}>
          <View
            style={{
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              transform: [{ translateY: Dimensions.get("window").height / 25 }],
            }}>
            <LoginLogo
              width={Dimensions.get("screen").width / 6.5}
              height={Dimensions.get("screen").width / 6.5}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}>
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                justifyContent: "center",
                gap: 24,
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  gap: 24,
                  backgroundColor: "transparent",
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: "#FFFFFF",
                    textAlign: "center",
                    paddingBottom: 8,
                  }}>
                  ログイン
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(start-jp)/user-login")}
                  style={{
                    width: "100%",
                  }}>
                  <LinearGradient
                    colors={["#F05A28", "#F39C12"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btnOutline}>
                    <Image
                      style={{ height: 24, width: 24 }}
                      resizeMode="contain"
                      source={require("@/assets/icons/email.png")}
                    />
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Email でログイン
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSelectAuth(Strategy.Google)}
                  style={{ width: "100%" }}>
                  <LinearGradient
                    colors={["#34A853", "#4285F4"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btnOutline}>
                    <Image
                      style={{ height: 40, width: 40 }}
                      resizeMode="contain"
                      source={require("@/assets/icons/google.png")}
                    />
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Google でログイン
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() => onSelectAuth(Strategy.Apple)}>
                  <LinearGradient
                    colors={["#000000", "#2E2E2E"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.btnOutline}>
                    <FontAwesome
                      style={{ paddingLeft: 20 }}
                      name="apple"
                      size={30}
                      color="#fff"
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        paddingLeft: 8,
                      }}>
                      Apple でログイン
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                {/* {Platform.OS === "android" && (
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
                    <Text style={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      লগইন করতে সমস্যা হলে ভিডিও টি দেখুন
                    </Text>
                    <Text>
                      <Ionicons name="play-circle" size={24} color={"#fff"} />
                    </Text>
                  </TouchableOpacity>
                )} */}
              </View>

              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#FFFFFF",
                  textAlign: "center",
                  lineHeight: 36,
                }}>
                まだアカウントをお持ちでない方{"\n"}
                <Link href="/(start-jp)/signup" asChild>
                  <Text
                    style={{
                      color: "#2ECC71",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}>
                    新規登録
                  </Text>
                </Link>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                paddingBottom: insets.bottom + 32,
              }}>
              <View
                style={{
                  backgroundColor: "transparent",
                  gap: 24,
                }}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Button
                    labelStyle={{
                      fontWeight: "600",
                      fontSize: 14,
                      color: "#BDC3C7",
                    }}
                    onPress={() => {
                      WebBrowser.openBrowserAsync(
                        "https://www.dutyai.app/legal/terms-and-conditions",
                        {
                          showTitle: false,
                          toolbarColor: "#6200EE",
                          enableBarCollapsing: false,
                        }
                      );
                    }}>
                    Term and condition
                  </Button>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 14,
                      color: "#BDC3C7",
                    }}>
                    |
                  </Text>
                  <Button
                    labelStyle={{
                      fontWeight: "600",
                      fontSize: 14,
                      color: "#BDC3C7",
                    }}
                    onPress={() => {
                      WebBrowser.openBrowserAsync(
                        "https://www.dutyai.app/legal/privacy-policy"
                      );
                    }}>
                    Privacy policies
                  </Button>
                </View>
                <Pressable
                  onPress={() => {
                    router.push("/contact");
                  }}>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 12,
                    }}>
                    <FontAwesome name="phone" size={16} color="#BDC3C7" />
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 14,
                        color: "#BDC3C7",
                      }}>
                      Contact us
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
            {/* <Text>1</Text> */}
            {/* <Text>2</Text> */}
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
    height: 56,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
});
