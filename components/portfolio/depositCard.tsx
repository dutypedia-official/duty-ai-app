import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SvgXml } from "react-native-svg";
import * as z from "zod";
import { radialBg } from "../svgs/radialBg";
import AnimatedInput from "./AnimatedInput";

const schema = z.object({
  amount: z
    .string({
      required_error: "Required",
    })
    .min(2, {
      message: "Required",
    }),
});

export default function DepositCard({ open, setOpen }: any) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";

  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
    },
  });

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    console.log("Form submitted:", data);
  };
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
            }}>
            <SvgXml
              xml={radialBg}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
              }}
            />

            <View
              style={{
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 5,
                borderWidth: 1,
                borderColor: isDark ? "#3C3C47" : "#E0E0E0",
                margin: 12,
                borderRadius: 24,
                overflow: "hidden",
              }}>
              <LinearGradient
                colors={
                  isDark ? ["#2A2B36", "#1C1C28"] : ["#E6E6E6", "#F9F9F9"]
                }
                style={{
                  paddingVertical: 44,
                  paddingHorizontal: 12,
                  alignItems: "center",
                  gap: 40,
                }}>
                <View
                  style={{
                    gap: 16,
                  }}>
                  <Text
                    style={{
                      color: isDark ? "#B0B0C3" : "#6B6B6B",
                      fontSize: 16,
                      textAlign: "center",
                    }}>
                    Current Balance
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#FDD835" : "#1E88E5",
                      fontSize: 28,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}>
                    ৳19000.98
                  </Text>
                </View>
                <View
                  style={{
                    gap: 13,
                    width: "100%",
                  }}>
                  <Controller
                    control={control}
                    name="amount"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <AnimatedInput
                        label="Enter Deposit Amount"
                        placeholder="00.00"
                        isDark={isDark} // Set to false for light mode
                        onChange={onChange} // Update value
                        value={value} // Pass current value
                        onBlur={onBlur} // Validation logic
                        error={error} // Optional error message
                      />
                    )}
                  />
                </View>
                <LinearGradient
                  colors={
                    isDark ? ["#1C1C1C", "#242424"] : ["#E6E6E6", "#F9F9F9"]
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    borderWidth: 1,
                    borderColor: isDark ? "#3C3C47" : "#EBEBEB",
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    width: "100%",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setOpen(false);
                    }}
                    style={{
                      flexGrow: 1,
                      borderRadius: 12,
                    }}>
                    <View
                      style={{
                        shadowColor: "#FF4500",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 4,
                      }}>
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#FF3A3A", "#FF5C5C"]
                            : ["#D84315", "#FF8A65"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isDark ? "#FFFFFF" : "#FFFFFF",
                          }}>
                          Cancel
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // disabled={!isFormValid}
                    onPress={() => {
                      handleSubmit(onSubmit)();
                    }}
                    style={{
                      flexGrow: 1,
                      borderRadius: 12,
                    }}>
                    <View
                      style={{
                        shadowColor: !isFormValid ? "transparent" : "#42A5F5",
                        shadowOffset: {
                          width: 0,
                          height: !isFormValid ? 0 : 4,
                        },
                        shadowOpacity: !isFormValid ? 0 : 0.7,
                        shadowRadius: !isFormValid ? 0 : 6,
                        elevation: !isFormValid ? 0 : 4,
                      }}>
                      <LinearGradient
                        colors={
                          !isFormValid
                            ? isDark
                              ? ["#3C3C47", "#3C3C47"]
                              : ["#E0E0E0", "#E0E0E0"]
                            : isDark
                            ? ["#007BFF", "#1E90FF"]
                            : ["#1E88E5", "#42A5F5"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: !isFormValid
                              ? isDark
                                ? "#666666"
                                : "#A0A0A0"
                              : isDark
                              ? "#FFFFFF"
                              : "#FFFFFF",
                          }}>
                          Deposit
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </LinearGradient>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
