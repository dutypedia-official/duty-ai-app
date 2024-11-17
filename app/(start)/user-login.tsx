import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  useColorScheme,
  TextInput,
  ActivityIndicator,
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
import { Modal, Portal } from "react-native-paper";
import { useState } from "react";
import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import * as WebBrowser from "expo-web-browser";
import { SvgUri } from "react-native-svg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const schema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string({ message: "Invalid password" })
    .min(8, { message: "Password must be between 8 and 20 characters long." })
    .max(20, {
      message: "Password must be between 8 and 20 characters long.",
    }),
});

export default function UserLoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
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
  const isBn = language === "Bn";
  const [visible, setVisible] = useState(false);
  const bgColor = useThemeColor({}, "background");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    if (data) {
      router.push("/main/discover/chat");
    }
  };

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
    <>
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
            title: "User Login",
            headerStyle: {
              backgroundColor: bgColor,
            },
          }}
        />

        <View />
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
                // position: "absolute",
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
        <View style={{ backgroundColor: "transparent", alignItems: "center" }}>
          <LoginLogo
            width={Dimensions.get("screen").width / 6.5}
            height={Dimensions.get("screen").width / 6.5}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "space-between",
            }}>
            <View
              style={{
                backgroundColor: "transparent",
                paddingTop: 40,
                gap: 24,
              }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 30,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}>
                Login
              </Text>
              <View style={{ gap: 12, backgroundColor: "transparent" }}>
                <FormInput
                  control={control}
                  name="email"
                  placeholder="Enter email"
                />
                <Controller
                  control={control}
                  name={"password"}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    const [isFocused, setIsFocused] = useState(false);
                    return (
                      <View style={{ backgroundColor: "transparent" }}>
                        <TextInput
                          style={[
                            styles.input,
                            {
                              paddingRight: 40,
                            },
                            error ? styles.errorInput : null,
                            isFocused ? styles.focusedInput : null,
                          ]}
                          placeholder={"Password"}
                          placeholderTextColor="#BDC3C7" // Added placeholder text color
                          onBlur={() => {
                            onBlur();
                            setIsFocused(false);
                          }}
                          onFocus={() => setIsFocused(true)}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry={!showPass}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPass(!showPass)}
                          style={{
                            position: "absolute",
                            right: 10,
                            top: 15,
                            zIndex: 10,
                          }}>
                          <Ionicons
                            name={!showPass ? "eye" : "eye-off"}
                            size={24}
                            color="#BDC3C7"
                          />
                        </TouchableOpacity>

                        {/* {error && ( */}
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: "transparent",
                            marginTop: 10,
                          }}>
                          {error?.message ? (
                            <Text style={styles.errorText}>
                              {error?.message}
                            </Text>
                          ) : (
                            <Text></Text>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              router.push("/forgot");
                            }}>
                            <Text
                              style={{
                                color: "#F0F2F5",
                              }}>
                              Forgot Password?
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {/* )} */}
                      </View>
                    );
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "transparent",
                  }}
                  disabled={!isFormValid}
                  onPress={() => {
                    handleSubmit(onSubmit)();
                  }}>
                  <LinearGradient
                    colors={
                      !isFormValid
                        ? ["#BDC3C7", "#AAB2B8"]
                        : ["#8E44AD", "#4E73DF"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      borderRadius: 12,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 3,
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        position: "relative",
                        backgroundColor: "transparent",
                      }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "bold",
                          fontSize: 20,
                          textAlign: "center",
                          opacity: isFormValid ? 1 : 0.5,
                        }}>
                        {isLoading && (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                            style={{ marginRight: 5 }}
                          />
                        )}
                        Continue
                      </Text>
                      <View
                        style={{
                          position: "absolute",
                          right: 0,
                          backgroundColor: "transparent",
                        }}>
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          style={{
                            color: "#FFFFFF",
                            opacity: isFormValid ? 1 : 0.5,
                          }}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <Button
                  mode="text"
                  labelStyle={{
                    fontWeight: "600",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}>
                  Don’t have an account?{" "}
                  <Link href="/signup" asChild>
                    <Text
                      style={{
                        color: "#2ECC71",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}>
                      Sign up
                    </Text>
                  </Link>
                </Button>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                backgroundColor: "transparent",
              }}>
              <View
                style={{
                  width: "46%",
                  padding: 1,
                  backgroundColor: "transparent",
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#AAAAAA",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: -5,
                  }}>
                  .................................................................................
                </Text>
              </View>
              <View style={{ backgroundColor: "transparent", flex: 1 }}>
                <Text
                  style={{
                    color: "#AAAAAA",
                    fontSize: 14,
                    textAlign: "center",
                  }}>
                  Or
                </Text>
              </View>
              <View
                style={{
                  width: "46%",
                  padding: 1,
                  backgroundColor: "transparent",
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#AAAAAA",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: -5,
                  }}>
                  .................................................................................
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              gap: 24,
            }}>
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
                  source={require("../../assets/icons/google.png")}
                />
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {isBn ? "গুগল দিয়ে লগইন করুন" : "Login with Google"}
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
                  {isBn ? "অ্যাপল দিয়ে লগইন করুন" : "Login with Apple"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
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
  input: {
    backgroundColor: "#333333",
    borderRadius: 12,
    color: "#ffffff",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    borderColor: "#4F5A5F",
  },
  errorInput: {
    borderColor: "#FA0000",
  },
  errorText: {
    color: "#EC2700",
    flex: 1,
  },
  focusedInput: {
    borderColor: "#4E73DF",
  },
});
