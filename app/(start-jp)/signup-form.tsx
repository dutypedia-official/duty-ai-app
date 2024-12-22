import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { useThemeColor, SafeAreaView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useSignUp } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";

const schema = z
  .object({
    email: z.string().email({
      message: "有効なメールアドレスを入力してください",
    }),
    password: z
      .string()
      .min(8, { message: "パスワードは 8 ～ 20 文字にする必要があります。" })
      .max(20, {
        message: "パスワードは 8 ～ 20 文字にする必要があります。",
      })
      .refine(
        (value) =>
          /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value),
        {
          message:
            "パスワードには英大小文字、数字、特殊文字のみを使用してください。",
        }
      ),
    retypePassword: z.string({ message: "パスワードが違います" }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "パスワードが違います",
    path: ["retypePassword"], // Focus the error on retypePassword
  });

export default function SignupForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [nameError, setNameError] = useState<any>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // State to track keyboard visibility
  const buttonOpacity = useRef(new Animated.Value(1)).current; // Ref for button opacity
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();

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

  useEffect(() => {
    if (name === "") {
      setNameError(null); // Do not show an error for an empty initial state
      return;
    }

    const specialCharacters = [
      "!",
      '"',
      "#",
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "?",
      "@",
      "[",
      "\\",
      "]",
      "^",
      "_",
      "`",
      "{",
      "|",
      "}",
      "~",
      `“`,
      "'",
    ];

    const containsSpecialCharacter = specialCharacters.some((char) =>
      name.includes(char)
    );

    if (containsSpecialCharacter) {
      setNameError("Use only letters and numbers.");
    } else if (name.length < 4) {
      setNameError("Min 4 max 20 characters also");
    } else if (name.length > 20) {
      setNameError("Min 4 max 20 characters also");
    } else {
      setNameError(null);
    }
  }, [name]);

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setNameError(null);
    fadeOutButton(); // Immediately hide button when input is focused
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
      retypePassword: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);

    if (data && nameError === null) {
      if (!isLoaded) {
        return;
      }

      try {
        setIsLoading(true);
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
          firstName: name,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        router.push({
          pathname: "/(start-jp)/verify-email",
          params: { email: data.email },
        });
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        Toast.show({
          type: "error",
          text1: err.errors[0].message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Signup Form",
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
          <View
            style={{
              position: "absolute",
              bottom: 280,
              opacity: 0.25,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}>
            <LoginLogo
              width={Dimensions.get("screen").width / 6.5}
              height={Dimensions.get("screen").width / 6.5}
            />
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "transparent",
            }}>
            <View
              style={{
                position: "absolute",
                top: insets.top,
                backgroundColor: "transparent",
                marginLeft: 20,
                zIndex: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{
                  position: "absolute",
                  top: 10,
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
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    style={{ color: "#FFFFFF" }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: Platform.OS === "ios" ? 0 : 60,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  gap: 24,
                  paddingHorizontal: 20,
                  flex: 1,
                  paddingTop:
                    Platform.OS === "ios" ? insets.top + 20 : insets.top + 40,
                  justifyContent: "space-between",
                }}>
                <View style={{ gap: 24 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 32,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}>
                    あなたのメールアドレス・名前・パスワードを入力してください
                  </Text>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      gap: 2,
                    }}>
                    <Text
                      style={{
                        color: "#ECECEC",
                        fontSize: 16,
                        fontWeight: "normal",
                        textAlign: "left",
                        lineHeight: 24,
                      }}>
                      メールアドレスは確認のためにのみ使用されます。
                      アカウント名: 4 ～ 20
                      文字のアルファベットを入力してください。 {"\n"}
                      パスワード: 8 ～ 20
                      文字のアルファベットを入力してください。
                    </Text>
                  </View>
                  <View style={{ gap: 12, zIndex: 20, position: "relative" }}>
                    <FormInput
                      control={control}
                      name="email"
                      label="メールアドレス"
                      placeholder="メールアドレスを入力"
                      onFocus={handleFocus} // Hide button immediately
                    />
                    <View style={{ backgroundColor: "transparent" }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          marginBottom: 8,
                        }}>
                        アカウント名
                      </Text>

                      <TextInput
                        style={[
                          styles.input,
                          { paddingRight: 12 },
                          isFocused && styles.focusedInput,
                        ]}
                        placeholder={"アカウント名を入力"}
                        placeholderTextColor="#BDC3C7"
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onChangeText={setName}
                        value={name}
                      />

                      {nameError && (
                        <Text style={styles.errorText}>{nameError}</Text>
                      )}
                    </View>
                    <FormInput
                      control={control}
                      name="password"
                      label="パスワード"
                      placeholder="パスワードを入力"
                      secureTextEntry={!showPass}
                      type={"password"}
                      icon={
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
                      }
                      onFocus={handleFocus} // Hide button immediately
                    />
                    <FormInput
                      control={control}
                      name="retypePassword"
                      label="パスワードを再入力"
                      placeholder="パスワードを再入力"
                      secureTextEntry={!showRePass}
                      icon={
                        <TouchableOpacity
                          onPress={() => setShowRePass(!showRePass)}
                          style={{
                            position: "absolute",
                            right: 15,
                            top: "50%",
                            transform: [{ translateY: -12 }],
                            zIndex: 10,
                          }}>
                          <Ionicons
                            name={!showRePass ? "eye" : "eye-off"}
                            size={24}
                            color="#BDC3C7"
                          />
                        </TouchableOpacity>
                      }
                      onFocus={handleFocus} // Hide button immediately
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>

        {/* Next Button with Smooth Fade Animation */}
        <Animated.View
          style={{
            opacity: buttonOpacity, // Use the animated opacity
            display: isKeyboardVisible ? "none" : "flex", // Ensure button is not interactive when hidden
            position: "relative",
            paddingTop: 20,
            paddingBottom: 32,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={handleSubmit(onSubmit)}>
            <LinearGradient
              colors={
                !isFormValid ? ["#4F5A5F", "#3A3D3F"] : ["#8E44AD", "#4E73DF"]
              }
              {...(isFormValid && {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
              })}
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
                  {!isLoading && "次へ"}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    right: 0,
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
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: "#333333",
    borderRadius: 12,
    color: "#ffffff",
    borderWidth: 1,
    paddingLeft: 12,
    paddingVertical: 16,
    fontSize: 16,
    borderColor: "#4F5A5F",
  },
  errorInput: {
    borderColor: "#FA0000",
  },
  errorText: {
    color: "#EC2700",
    marginTop: 8,
  },
  focusedInput: {
    borderColor: "#4E73DF",
  },
});
