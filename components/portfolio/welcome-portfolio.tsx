import useLang from "@/lib/hooks/useLang";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { portfolioEmptySvg } from "../svgs/portfolioEmptySvg";
import { playButtonSound } from "@/lib/utils";

export default function WelcomePortfolio() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [firstName, setFirstName] = useState<string | null | undefined>("");
  const [lastName, setLastName] = useState<string | null | undefined>("");

  useEffect(() => {
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
  }, [user]);

  const users = [
    {
      uri: "../.././assets/images/user-1.jpg",
    },
    {
      uri: "../.././assets/images/user-2.jpg",
    },
    {
      uri: "../.././assets/images/user-1.jpg",
    },
    {
      uri: "../.././assets/images/user-2.jpg",
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top,
      }}>
      <StatusBar barStyle={"dark-content"} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            paddingTop: 60,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
            }}>
            <View
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "#fff",
                paddingHorizontal: 12,
              }}>
              <SvgXml
                // preserveAspectRatio="xMidYMid slice"
                xml={portfolioEmptySvg}
                width="100%"
              />
            </View>
            <View
              style={{
                backgroundColor: isDark ? "#2E2E2E" : "#F0F2F5",
                flex: 1,
                paddingHorizontal: 12,
                paddingTop: 60,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      gap: 16,
                    }}>
                    <View
                      style={{
                        gap: 8,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: isDark ? "#A3A3A3" : "#333333",
                        }}>
                        Hello
                      </Text>
                      <Text
                        style={{
                          color: isDark ? "#FFFFFF" : "#000000",
                          fontWeight: "bold",
                          fontSize: 24,
                        }}>
                        {`${firstName} ${!lastName ? "" : lastName}`}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: isDark ? "#D0D0D0" : "#666666",
                        }}>
                        {isBn
                          ? `🌟 বড় স্বপ্ন দেখুন, স্মার্ট ট্রেড করুন!পুরনো স্টাইলকে বিদায় জানান, ডিউটি এআই-এর সাথে স্মার্ট লেনদেন শুরু করুন।\n\n🔥 আজই আপনার পোর্টফোলিও তৈরি করে সফলতার নতুন অধ্যায় রচনা করুন।`
                          : `🌟 Dream big, trade smart!Say goodbye to old trading styles and start smart trading with Duty AI.\n\n🔥 Create your portfolio today and write a new chapter of success.`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                        }}>
                        <View
                          style={{
                            width: 28.57,
                            height: 28.57,
                            borderRadius: 999,
                            borderWidth: 0.89,
                            borderColor: "#E0E0E0",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            marginRight: -10,
                          }}>
                          <Image
                            source={require("../.././assets/images/user-1.jpg")}
                            resizeMode="cover"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: 28.57,
                            height: 28.57,
                            borderRadius: 999,
                            borderWidth: 0.89,
                            borderColor: "#E0E0E0",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            marginRight: -10,
                          }}>
                          <Image
                            source={require("../.././assets/images/user-2.jpg")}
                            resizeMode="cover"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: 28.57,
                            height: 28.57,
                            borderRadius: 999,
                            borderWidth: 0.89,
                            borderColor: "#E0E0E0",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            marginRight: -10,
                          }}>
                          <Image
                            source={require("../.././assets/images/user-3.jpeg")}
                            resizeMode="cover"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: 28.57,
                            height: 28.57,
                            borderRadius: 999,
                            borderWidth: 0.89,
                            borderColor: "#E0E0E0",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            marginRight: 0,
                          }}>
                          <Image
                            source={require("../.././assets/images/user-4.jpeg")}
                            resizeMode="cover"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </View>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: isDark ? "#666666" : "#666666",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}>
                          {isBn
                            ? "১০k+ মানুষ এটি ব্যবহার করছে"
                            : "10k+ people use this"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignContent: "flex-end",
                    paddingVertical: insets.bottom + 24,
                    gap: 24,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      playButtonSound(require("@/assets/ipad_click.mp3"));
                      router.dismissTo("/main/portfolio");
                    }}
                    style={{
                      flex: 1,
                      shadowColor: "#000000",
                      shadowOffset: { width: 0, height: 11.56 },
                      shadowOpacity: 0.06,
                      shadowRadius: 23.12,
                      elevation: 23.12,
                      position: "relative",
                    }}>
                    <LinearGradient
                      colors={["#0D47A1", "#1976D2"]}
                      start={{
                        x: 0,
                        y: 0,
                      }}
                      end={{
                        x: 1,
                        y: 0,
                      }}
                      style={{
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 23,
                        paddingVertical: 16,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#FFFFFF",
                        }}>
                        {isBn ? "এখনই শুরু করুন" : "Start now"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                    }}>
                    <View
                      style={{
                        backgroundColor: "#667CE9",
                        height: 6,
                        width: 32,
                        borderRadius: 6.32,
                      }}></View>
                    <View
                      style={{
                        backgroundColor: "#9A9A9A",
                        height: 6,
                        width: 32,
                        borderRadius: 6.32,
                      }}></View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
