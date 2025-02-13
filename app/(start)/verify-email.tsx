import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import FormInput from "@/components/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignUp } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

const schema = z.object({
  otp: z
    .string()
    .min(6, {
      message: "OTP must be 6 digits",
    })
    .regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
});

export default function VerifyEmail() {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();
  const [invalidCode, setInvalidCode] = useState(null);
  const _3M = 179;
  const [timeLeft, setTimeLeft] = React.useState(_3M);
  const [isCounting, setIsCounting] = React.useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const buttonOpacity = useRef(new Animated.Value(1)).current; // Animated value for button opacity

  useEffect(() => {
    // Keyboard listener to hide/show the button smoothly
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      fadeOutButton // Hide button when keyboard opens
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      fadeInButton // Show button when keyboard closes
    );

    // Cleanup the listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const fadeOutButton = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0,
      duration: 0, // Instant disappearance
      useNativeDriver: true,
    }).start();
  };

  const fadeInButton = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease), // Easing for smoothness
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
      otp: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    if (data) {
      if (!isLoaded) {
        return;
      }

      try {
        setIsLoading(true);
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.otp,
        });

        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push("/main/home");
        } else {
          console.error(JSON.stringify(completeSignUp, null, 2));
        }
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        setInvalidCode(err.errors[0]?.longMessage || "Invalid OTP");
        // Toast.show({
        //   type: "error",
        //   text1: err.errors[0]?.longMessage || "Invalid OTP",
        // });
      } finally {
        setIsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    let timer: any;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartCount = async () => {
    try {
      if (!isLoaded) {
        return;
      }
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setTimeLeft(_3M); // Reset to 3 minutes
      setIsCounting(true);
      Toast.show({
        type: "success",
        text1: "OTP sent successfully",
      });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: err.errors[0]?.message || "Failed to send OTP",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <StatusBar style="light" />

          <Stack.Screen
            options={{
              headerShown: false,
              title: "Signup",
              headerStyle: {
                backgroundColor: bgColor,
              },
            }}
          />

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

          <View
            style={{
              backgroundColor: "transparent",
              paddingHorizontal: 20,
              paddingTop: 20,
              justifyContent: "space-between",
              flex: 1,
            }}>
            <View
              style={{
                gap: 24,
              }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 32,
                  fontWeight: "bold",
                  textAlign: "left",
                }}>
                Verify your email
              </Text>
              <Text
                style={{
                  color: "#ECECEC",
                  fontSize: 16,
                  fontWeight: "normal",
                  textAlign: "left",
                  lineHeight: 24,
                }}>
                A verification code has been sent to {"\n"}
                {params?.email}. Please enter the code to proceed. If you don't
                see it in your inbox, kindly check your spam or junk folder.
              </Text>
              <View style={{ gap: 12 }}>
                <FormInput
                  control={control}
                  name="otp"
                  placeholder="Enter the code"
                  inputMode={"numeric"}
                />
                {invalidCode && (
                  <View>
                    <Text
                      style={{
                        color: "#EC2700",
                        fontWeight: "normal",
                        fontSize: 14,
                      }}>
                      {invalidCode}
                    </Text>
                  </View>
                )}

                {isCounting ? (
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}>
                    Wait {formatTime(timeLeft)} before requesting another code
                  </Text>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                    }}>
                    <View>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontWeight: "normal",
                          fontSize: 14,
                        }}>
                        Did not receive it yet?{" "}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={handleStartCount}>
                      <Text
                        style={{
                          color: "#EC2700",
                          fontWeight: "normal",
                          fontSize: 14,
                        }}>
                        Send again.
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Animated Next Button */}
            <Animated.View
              style={{
                opacity: buttonOpacity,
                position: "absolute", // Make sure the button stays in the same position
                bottom: insets.bottom + 32, // Ensure there is always padding from the bottom
                left: 20,
                right: 20,
              }}>
              <TouchableOpacity
                disabled={!isFormValid}
                onPress={handleSubmit(onSubmit)}>
                <LinearGradient
                  colors={
                    !isFormValid
                      ? ["#4F5A5F", "#3A3D3F"]
                      : ["#8E44AD", "#4E73DF"]
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
                      )}{" "}
                      {!isLoading && "Confirm and login"}
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
