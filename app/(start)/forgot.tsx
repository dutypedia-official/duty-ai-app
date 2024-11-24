import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { useSignIn } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

const schema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function Forgot() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();
  const [wrongEmail, setWrongEmail] = React.useState(false);
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
      email: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);

    if (data) {
      if (!isLoaded) return;

      try {
        setIsLoading(true);
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: data.email,
        });

        Toast.show({
          type: "success",
          text1: "A password reset link has been sent to your email.",
        });
        router.push({
          pathname: "/change-password",
          params: { email: data.email },
        });
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        Toast.show({
          type: "error",
          text1: err.errors[0]?.longMessage || "Failed to send OTP",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Full Screen Background Gradient */}
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

        <StatusBar style="light" />

        <Stack.Screen
          options={{
            headerShown: false,
            title: "Forgot",
            headerStyle: {
              backgroundColor: bgColor,
            },
          }}
        />

        <View
          style={{
            backgroundColor: "transparent",
            marginLeft: 20,
            paddingVertical: 10,
            zIndex: 1000, // Ensure back button is on top
          }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
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
                Enter your email address
              </Text>
              <Text
                style={{
                  color: "#ECECEC",
                  fontSize: 16,
                  fontWeight: "normal",
                  textAlign: "left",
                  lineHeight: 24,
                }}>
                Your privacy is important to us. Rest assured, your email
                address will only be used for verification purposes.
              </Text>
              <View style={{ gap: 12 }}>
                <FormInput
                  control={control}
                  name="email"
                  placeholder="Enter email"
                  onFocus={fadeOutButton} // Immediately hide button when input is focused
                />
                {wrongEmail && (
                  <Text
                    style={{
                      color: "#CE1300",
                      fontWeight: "normal",
                      fontSize: 14,
                    }}>
                    Email does not exist.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

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
                  {!isLoading && "Next"}
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
