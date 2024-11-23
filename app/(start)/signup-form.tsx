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
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
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

const schema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
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

export default function Forgot() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [nameError, setNameError] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();

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
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
          firstName: name,
        });
        setIsLoading(true);
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        router.push("/verify-email");
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
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Signup Form",
          headerStyle: {
            backgroundColor: bgColor,
          },
        }}
      />
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60} // Adjust as needed
          style={{
            flex: 1,
          }}>
          <View
            style={{
              // paddingTop: insets.top,
              backgroundColor: "transparent",
              marginLeft: 20,
              paddingVertical: 10,
              position: "absolute",
              zIndex: 10,
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
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.25,
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}>
            <View
              style={{
                transform: [{ translateY: 100 }],
              }}>
              <LoginLogo
                width={Dimensions.get("screen").width / 6.5}
                height={Dimensions.get("screen").width / 6.5}
              />
            </View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: "transparent",
                paddingHorizontal: 20,
                paddingTop: insets.top + 40,
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
                  Please enter your email, name, and password
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
                    }}>
                    Email Privacy: Your email is used only for verification.
                  </Text>
                  <Text
                    style={{
                      color: "#ECECEC",
                      fontSize: 16,
                      fontWeight: "normal",
                      textAlign: "left",
                    }}>
                    Name: Use 4-20 alphabetic characters.
                  </Text>
                  <Text
                    style={{
                      color: "#ECECEC",
                      fontSize: 16,
                      fontWeight: "normal",
                      textAlign: "left",
                    }}>
                    Password: 8-20 characters for strong security.
                  </Text>
                </View>
                <View style={{ gap: 12 }}>
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Type email"
                  />
                  <View style={{ backgroundColor: "transparent" }}>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        marginBottom: 8,
                      }}>
                      Your Name
                    </Text>

                    <TextInput
                      style={[
                        styles.input,
                        { paddingRight: 12 },
                        isFocused && styles.focusedInput,
                      ]}
                      placeholder={"Your name"}
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
                  />
                  <FormInput
                    control={control}
                    name="retypePassword"
                    label="Retype"
                    placeholder="Retype Password"
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
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View
          style={{
            position: "relative",
            paddingTop: 20,
            paddingBottom: insets.bottom + 32,
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
                  Next
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
        </View>
      </SafeAreaView>
    </View>
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
