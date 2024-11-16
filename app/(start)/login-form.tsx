import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginLogo from "@/components/svgs/login-logo";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";

const schema = z
  .object({
    name: z
      .string()
      .min(4, { message: "min 4 max 20 cherecters" })
      .max(20, { message: "min 4 max 20 cherecters" })
      .regex(/^[A-Za-z]+$/),
    password: z
      .string()
      .min(8, { message: "Password must be between 8 and 20 characters long." })
      .max(20, {
        message: "Password must be between 8 and 20 characters long.",
      }),
    retypePassword: z.string({ message: "Password confirmation is required." }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords do not match.",
    path: ["retypePassword"], // Focus the error on retypePassword
  });

export default function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      password: "",
      retypePassword: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <StatusBar style="light" />

          <Stack.Screen
            options={{
              headerShown: false,
              title: "LoginForm",
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
              alignItems: "center",
              opacity: 0.25,
              position: "absolute",
              bottom: "35%",
              left: "50%",
              transform: [{ translateX: -50 }],
            }}>
            <LoginLogo
              width={Dimensions.get("screen").width / 6.5}
              height={Dimensions.get("screen").width / 6.5}
            />
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
                Name and password
              </Text>
              <View>
                <Text
                  style={{
                    color: "#ECECEC",
                    fontSize: 14,
                    fontWeight: "normal",
                    textAlign: "left",
                    lineHeight: 24,
                  }}>
                  Use alphabetic characters only. Name should be{" "}
                  <Text
                    style={{
                      color: "#ECECEC",
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}>
                    {" "}
                    4-20 characters.
                  </Text>
                </Text>
                <Text
                  style={{
                    color: "#ECECEC",
                    fontSize: 14,
                    fontWeight: "normal",
                    textAlign: "left",
                    lineHeight: 24,
                  }}>
                  Please create a strong password between&nbsp;
                  <Text
                    style={{
                      color: "#ECECEC",
                      fontSize: 14,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}>
                    8 and 20 characters&nbsp;
                  </Text>
                  to ensure the security of your account.
                </Text>
              </View>
              <View style={{ gap: 12 }}>
                <Controller
                  control={control}
                  name={"name"}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <View style={styles.container}>
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
                            error ? styles.errorInput : null,
                          ]}
                          placeholder={"Enter your name"}
                          placeholderTextColor="#BDC3C7" // Added placeholder text color
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />

                        {error && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}>
                            {error?.type === "invalid_string" ? (
                              <Text style={styles.errorText}>
                                Use only letters
                              </Text>
                            ) : (
                              <Text></Text>
                            )}

                            {error?.message === "min 4 max 20 cherecters" ? (
                              <Text style={styles.errorText}>
                                min 4 max 20 cherecters
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

                <FormInput
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Password"
                  secureTextEntry
                />
                <FormInput
                  control={control}
                  name="retypePassword"
                  label="Retype"
                  placeholder="Retype"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={{}}>
              <TouchableOpacity
                disabled={!isValid}
                onPress={handleSubmit(onSubmit)}>
                <LinearGradient
                  colors={
                    !isValid ? ["#4F5A5F", "#3A3D3F"] : ["#8E44AD", "#4E73DF"]
                  }
                  {...(isValid && {
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
                        opacity: isValid ? 1 : 0.5,
                      }}>
                      {isLoading && (
                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                          style={{ marginRight: 5 }}
                        />
                      )}{" "}
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
                        style={{ color: "#FFFFFF", opacity: isValid ? 1 : 0.5 }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
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
    marginTop: 8,
  },
});
