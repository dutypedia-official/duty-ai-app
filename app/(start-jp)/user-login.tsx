import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  ScrollView,
  View,
  Keyboard,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";

import { SafeAreaView, Text, useThemeColor } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { useSignIn } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
}

const schema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください",
  }),
  password: z
    .string()
    .min(8, { message: "パスワードは 8 ～ 20 文字にする必要があります。" })
    .max(20, {
      message: "パスワードは 8 ～ 20 文字にする必要があります。",
    }),
});

export default function UserLoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded, setActive } = useSignIn();
  const [showPass, setShowPass] = useState(false);
  const insets = useSafeAreaInsets();
  useWarmUpBrowser();
  const router = useRouter();
  const { getToken } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const langStore = useLang();
  const { language } = langStore;
  const isBn = language === "bn";
  const bgColor = useThemeColor({}, "background");
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // State to track keyboard visibility
  const buttonOpacity = useRef(new Animated.Value(1)).current; // Ref for button opacity

  useEffect(() => {
    // Add event listeners for keyboard show and hide
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        fadeInButton();
        setIsKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Add event listeners for keyboard show and hide
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const fadeOutButton = () => {
    buttonOpacity.setValue(0); // Set to zero immediately to hide
  };

  const fadeInButton = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease), // Use easing to smooth the animation
    }).start();
  };

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

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    fadeOutButton(); // Immediately hide button when input is focused
  };
  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    if (data) {
      if (!isLoaded) return;

      try {
        setIsLoading(true);
        const completeSignIn = await signIn.create({
          identifier: values.email,
          password: values.password,
        });
        await setActive({ session: completeSignIn.createdSessionId });
        console.log("Logged in successfully!");
        router.dismissTo("/(start-jp)/market");
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        Toast.show({
          type: "error",
          text1: "Invalid email or password",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.dismissTo("/(start-jp)/market");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}>
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
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}>
          <LinearGradient
            colors={["#4A148C", "#2A2B2A"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
            }}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <View />

          <View
            style={{
              paddingTop: insets.top + 12,
              backgroundColor: "transparent",
              marginLeft: 20,
              paddingVertical: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}>
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
            style={{ backgroundColor: "transparent", alignItems: "center" }}>
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
                  ログイン
                </Text>
                <View style={{ gap: 12, backgroundColor: "transparent" }}>
                  <FormInput
                    control={control}
                    name="email"
                    placeholder="メールアドレス"
                    onFocus={fadeOutButton}
                  />
                  <Controller
                    control={control}
                    name={"password"}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <View
                          style={{
                            backgroundColor: "transparent",
                            position: "relative",
                          }}>
                          {/* Wrapper for TextInput and Icon */}
                          <View
                            style={{
                              position: "relative",
                              minHeight: 60, // Ensures consistent height for the container
                              justifyContent: "center",
                            }}>
                            <TextInput
                              style={[
                                styles.input,
                                {
                                  paddingRight: 40,
                                },
                                error ? styles.errorInput : null,
                                isFocused ? styles.focusedInput : null,
                              ]}
                              placeholder={"パスワード"}
                              placeholderTextColor="#BDC3C7"
                              onBlur={handleBlur}
                              onFocus={handleFocus}
                              onChangeText={onChange}
                              value={value}
                              secureTextEntry={!showPass}
                            />
                            <TouchableOpacity
                              onPress={() => setShowPass(!showPass)}
                              style={{
                                position: "absolute",
                                right: 15,
                                top: "50%",
                                transform: [{ translateY: -12 }],
                                zIndex: 10,
                              }}>
                              <Ionicons
                                name={!showPass ? "eye" : "eye-off"}
                                size={24}
                                color="#BDC3C7"
                              />
                            </TouchableOpacity>
                          </View>

                          {/* Error Message */}
                          {error && (
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
                            </View>
                          )}
                        </View>
                      );
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "transparent",
                    }}>
                    <View />
                    <TouchableOpacity
                      onPress={() => {
                        router.push("/(start-jp)/forgot");
                      }}>
                      <Text
                        style={{
                          color: "#F0F2F5",
                        }}>
                        パスワードを忘れた方
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                          {!isLoading && "ログイン"}
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
              </View>
              {!isKeyboardVisible && (
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
              )}
            </View>
            {!isKeyboardVisible && (
              <Animated.View
                style={{
                  opacity: buttonOpacity, // Use the animated opacity
                  display: isKeyboardVisible ? "none" : "flex", // Ensure button is not interactive when hidden
                  backgroundColor: "transparent",
                  gap: 24,
                  paddingBottom: insets.bottom + 32,
                }}
                pointerEvents={isKeyboardVisible ? "none" : "auto"} // Disable interactions when the button is hidden
              >
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
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
