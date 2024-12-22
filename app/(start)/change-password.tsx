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
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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

const schema = z
  .object({
    otp: z
      .string()
      .min(6, {
        message: "OTP must be 6 digits",
      })
      .regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
    password: z
      .string()
      .min(8, { message: "Password must be between 8 and 20 characters long." })
      .max(20, {
        message: "Password must be between 8 and 20 characters long.",
      })
      .refine(
        (value) =>
          /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value),
        {
          message:
            "Password can only contain letters, numbers, and special characters.",
        }
      ),
    retypePassword: z.string({ message: "Passwords do not match." }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match.",
    path: ["retypePassword"], // Focus the error on retypePassword
  });

export default function ChangePassword() {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [invalidCode, setInvalidCode] = useState(null);
  const _3M = 179;
  const [timeLeft, setTimeLeft] = useState(_3M);
  const [isCounting, setIsCounting] = useState(false);
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // State to track keyboard visibility
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

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
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
      otp: "",
      password: "",
      retypePassword: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  useEffect(() => {
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
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: params?.email as string,
      });
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

  const onSubmit = async (data: any) => {
    if (!isLoaded) {
      return;
    }
    try {
      setIsLoading(true);
      const completeSignIn = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.otp,
        password: data.password,
      });

      if (completeSignIn?.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.push("/main/");
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
            title: "Forgot",
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
          <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
            {/* <View
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
                Change Password
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
                {params?.email}. Check your spam if you don't see it. {"\n"}
                Please create a strong password (8-20 characters).
              </Text>

              <View style={{ gap: 12 }}>
                <View
                  style={{
                    gap: 24,
                  }}>
                  <View style={{ gap: 12 }}>
                    <FormInput
                      control={control}
                      name="otp"
                      placeholder="Enter the code"
                      inputMode={"numeric"}
                      onFocus={handleFocus} // Hide button immediately
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
                        Wait {formatTime(timeLeft)} before requesting another
                        code
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
                  <FormInput
                    control={control}
                    name="password"
                    label="Password"
                    placeholder="Type Password"
                    secureTextEntry={!showPass}
                    type={"password"}
                    icon={
                      <TouchableOpacity
                        onPress={() => setShowPass(!showPass)}
                        style={{
                          position: "absolute",
                          right: 15, // Padding from the right
                          top: "50%", // Center vertically
                          transform: [{ translateY: -12 }], // Adjust for icon size
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
                    label="Retype"
                    placeholder="Type Retype"
                    secureTextEntry={!showRePass}
                    icon={
                      <TouchableOpacity
                        onPress={() => setShowRePass(!showRePass)}
                        style={{
                          position: "absolute",
                          right: 15, // Padding from the right
                          top: "50%", // Center vertically
                          transform: [{ translateY: -12 }], // Adjust for icon size
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

            <Animated.View
              style={{
                paddingBottom: insets.bottom + 32,
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
                      {!isLoading && "Confirm to login"}
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
          </View> */}

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
                    Change Password
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
                      A verification code has been sent to {"\n"}
                      {params?.email}. Check your spam if you don't see it.{" "}
                      {"\n"}
                      Please create a strong password (8-20 characters).
                    </Text>
                  </View>
                  <View style={{ gap: 12, zIndex: 20, position: "relative" }}>
                    <View style={{ gap: 12 }}>
                      <View>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontSize: 16,
                            marginBottom: 8,
                          }}>
                          Verification code
                        </Text>
                        <FormInput
                          control={control}
                          name="otp"
                          placeholder="Enter the code"
                          inputMode={"numeric"}
                          onFocus={handleFocus} // Hide button immediately
                        />
                      </View>
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
                          Wait {formatTime(timeLeft)} before requesting another
                          code
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

                    <FormInput
                      control={control}
                      name="password"
                      label="Password"
                      placeholder="Type Password"
                      secureTextEntry={!showPass}
                      type={"password"}
                      icon={
                        <TouchableOpacity
                          onPress={() => setShowPass(!showPass)}
                          style={{
                            position: "absolute",
                            right: 15, // Padding from the right
                            top: "50%", // Center vertically
                            transform: [{ translateY: -12 }], // Adjust for icon size
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
                      label="Retype"
                      placeholder="Type Retype"
                      secureTextEntry={!showRePass}
                      icon={
                        <TouchableOpacity
                          onPress={() => setShowRePass(!showRePass)}
                          style={{
                            position: "absolute",
                            right: 15, // Padding from the right
                            top: "50%", // Center vertically
                            transform: [{ translateY: -12 }], // Adjust for icon size
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
                  )}{" "}
                  {!isLoading && "Confirm to login"}
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
