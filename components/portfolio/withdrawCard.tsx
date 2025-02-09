import { apiClientPortfolio } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { formattedBalance, playButtonSound } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import * as z from "zod";
import { radialBg } from "../svgs/radialBg";
import AnimatedInput from "./AnimatedInput";
import { formattedBalanceNew } from "./assetsBalCard";

export default function WithdrawCard({ open, setOpen }: any) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const clientPortfolio = apiClientPortfolio();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { freeBalance, setRefreash, refreash } = useUi();
  const [esPlay, setEsPlay] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [afterWithdraw, setAfterWithdraw] = useState(false);

  const schema = z.object({
    amount: z
      .string({
        required_error: isBn ? "ন্যূনতম ৳১ প্রয়োজন!" : "Minimum ৳1 required!", // Error message when the field is empty
      })
      .min(0.05, {
        message: isBn ? "ন্যূনতম ৳০.০৫ প্রয়োজন!" : "Minimum ৳0.05 required!", // Error message for minimum length
      })
      .max(1000000000, {
        message: isBn
          ? "সীমা ৳১,০০০,০০০,০০০ অতিক্রম হয়েছে! পরিমাণ কমান।"
          : `Limit ৳1,000,000,000 exceeded! Reduce amount.`,
      })
      .refine(
        (value) => {
          const amount = parseFloat(value);

          return (
            !isNaN(amount) && amount > 0 && amount <= parseFloat(freeBalance)
          );
        },
        {
          message: isBn ? "আপনার তহবিল কম" : `Your Fund is Low`,
        }
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
    },
  });

  // Function to play a sound
  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setEsPlay(false);
        }
      });
    } catch (error) {
      console.log("Error playing sound:", error);
      setEsPlay(false);
    }
  };

  // Play error sound when validation errors occur
  useEffect(() => {
    if (errors.amount?.message && esPlay) {
      playSound(require("@/assets/error.mp3")); // Play error sound
    }
  }, [errors.amount]);

  // Function to play a sound
  const playSoundAfterWithdraw = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setAfterWithdraw(false);
        }
      });
    } catch (error) {
      console.log("Error playing sound:", error);
      setAfterWithdraw(false);
    }
  };

  const afterWithdrawRef = useRef(false);

  useEffect(() => {
    if (afterWithdraw && !afterWithdrawRef.current) {
      afterWithdrawRef.current = true; // Mark it as played
      setTimeout(() => {
        playSoundAfterWithdraw(require("@/assets/coin-add.mp3"));
        // Reset ref after sound plays, allowing re-trigger
        afterWithdrawRef.current = false;
      }, 2000);
    }
  }, [afterWithdraw]);

  const values = watch();
  const isFormValid = Object.values(values).every((val) => val.trim() !== "");

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    const sound = new Audio.Sound();
    try {
      setIsSubmitting(true);
      console.log("Form submitted:", data);
      const token = await getToken();
      await clientPortfolio.post(
        "/portfolio/withdraw",
        {
          amount: data.amount,
        },
        token
      );

      // Load the MP3 file
      await sound.loadAsync(require("@/assets/banknote.mp3")); // Replace with your MP3 path
      await sound.playAsync();
      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync(); // Clean up
          setRefreash(!refreash);
          setIsSubmitting(false);
          setOpen(false);
          setAfterWithdraw(true);
        }
      });
    } catch (error) {
      // Load the MP3 file
      await sound.loadAsync(require("@/assets/error.mp3")); // Replace with your MP3 path
      await sound.playAsync();
      // Wait for playback to finish
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync(); // Clean up
          setIsSubmitting(false);
          setAfterWithdraw(false);
        }
      });
      console.log(error);
    }
  };

  useEffect(() => {
    reset();
    setIsSubmitting(false);
    setEsPlay(false);
    setAfterWithdraw(false);
  }, [open]);

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIsFocused(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "rgba(26,26,26,0.2)",
            }}
          >
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
              }}
            >
              <LinearGradient
                colors={
                  isDark ? ["#2A2B36", "#1C1C28"] : ["#E6E6E6", "#F9F9F9"]
                }
                style={{
                  paddingVertical: 44,
                  paddingHorizontal: 12,
                  alignItems: "center",
                  gap: 40,
                }}
              >
                <View
                  style={{
                    gap: 16,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "#B0B0C3" : "#6B6B6B",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {isBn ? "উত্তোলনের জন্য আছে" : "Available for withdraw"}
                  </Text>
                  <Text
                    style={{
                      color:
                        errors.amount || parseFloat(freeBalance) === 0
                          ? "#EC2700"
                          : isDark
                          ? "#FDD835"
                          : "#1E88E5",
                      fontSize: 28,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    ৳{formattedBalanceNew(freeBalance)}
                  </Text>
                </View>
                <View
                  style={{
                    gap: 13,
                    width: "100%",
                  }}
                >
                  <Controller
                    control={control}
                    name="amount"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <AnimatedInput
                        inputMode="numeric"
                        label={isBn ? "পরিমাণ লিখুন" : "Enter Amount"}
                        placeholder="00.00"
                        isDark={isDark} // Set to false for light mode
                        onChange={onChange} // Update value
                        value={value} // Pass current value
                        onBlur={onBlur} // Validation logic
                        error={error} // Optional error message
                        inputColor={
                          isDark
                            ? ["#292A36", "#292A36"]
                            : ["#FFFFFF", "#F7F7F7"]
                        }
                        errorInputColor={"#EC2700"}
                        inputShadow={{
                          shadowColor: isDark ? "#333333" : "#42A5F5",
                          shadowOffset: {
                            width: 0,
                            height: 4,
                          },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                          elevation: 4,
                        }}
                        startColorOutRange={
                          isDark
                            ? ["#292A36", "#252531"]
                            : ["#FCFCFC", "#EDEDED"]
                        }
                        endColorOutRange={
                          isDark
                            ? ["#292A36", "#292A36"]
                            : ["#FCFCFC", "#FCFCFC"]
                        }
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
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound(require("@/assets/ipad_click.mp3"));
                        setOpen(false);
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                      }}
                    >
                      <View
                        style={{
                          shadowColor: "#FF4500",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }}
                      >
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
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: isDark ? "#FFFFFF" : "#FFFFFF",
                            }}
                          >
                            {isBn ? "বাতিল করুন" : "Cancel"}
                          </Text>
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound(require("@/assets/ipad_click.mp3"));
                        handleSubmit(onSubmit)();
                        setEsPlay(true);
                      }}
                      style={{
                        flex: 1,
                        borderRadius: 12,
                      }}
                    >
                      <View
                        style={{
                          shadowColor:
                            !isFormValid || isSubmitting
                              ? "transparent"
                              : "#42A5F5",
                          shadowOffset: {
                            width: 0,
                            height: !isFormValid ? 0 : 4,
                          },
                          shadowOpacity: !isFormValid ? 0 : 0.7,
                          shadowRadius: !isFormValid ? 0 : 6,
                          elevation: !isFormValid ? 0 : 4,
                        }}
                      >
                        <LinearGradient
                          colors={
                            !isFormValid || isSubmitting
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
                          }}
                        >
                          {isSubmitting ? (
                            <ActivityIndicator size={"small"} />
                          ) : (
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
                              }}
                            >
                              {isBn ? "উত্তোলন করুন" : "Withdraw"}
                            </Text>
                          )}
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </LinearGradient>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
