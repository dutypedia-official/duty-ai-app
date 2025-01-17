import { coin } from "@/assets/icons/coin";
import { globe, globeDark } from "@/assets/icons/globe";
import { setting_bg_light } from "@/assets/icons/setting_bg_light";
import { fb, file, shield, yt } from "@/assets/icons/socials";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { differenceInSeconds } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

export default function UpdateSetting() {
  const insets = useSafeAreaInsets();
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const expiryDate = new Date("2025-01-26T00:00:00");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      if (expiryDate > now) {
        const totalSeconds = differenceInSeconds(expiryDate, now);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        // Format the remaining time as "X day HH:MM:SS"
        setTimeLeft(
          `${days} day ${hours}:${minutes < 10 ? "0" : ""}${minutes}`
        );
      } else {
        setTimeLeft("Expired");
      }
    };

    // Calculate the time immediately and then every second
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [expiryDate]);

  const settingOptions = [
    {
      leftIcon: <FontAwesome name="envelope" size={24} color="#E5A100" />,
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-60deg" }],
          }}
        />
      ),
      title: "Email & Password",
    },
    {
      leftIcon: (
        <View>
          <SvgXml xml={coin} width={24} height={24} />
        </View>
      ),
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-60deg" }],
          }}
        />
      ),
      title: "Recharge History",
    },
    {
      leftIcon: <FontAwesome6 name="trash" size={24} color="#FF7043" />,
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-60deg" }],
          }}
        />
      ),
      title: "Delete account",
    },
    {
      leftIcon: <FontAwesome name="envelope" size={24} color="#E5A100" />,
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-60deg" }],
          }}
        />
      ),
      title: "Log out",
    },
  ];

  const socialLinks = [
    {
      svg: isDark ? fb : fb,
      link: "",
    },
    {
      svg: isDark ? yt : yt,
      link: "",
    },
    {
      svg: isDark ? file : file,
      link: "",
    },
    {
      svg: isDark ? shield : shield,
      link: "",
    },
  ];
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}>
        <View
          style={{
            position: "absolute",
            pointerEvents: "none",
            flex: 1,
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}>
          <SvgXml xml={setting_bg_light} preserveAspectRatio="xMidYMid slice" />
        </View>

        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 12,
            }}>
            <View
              style={{
                gap: 40,
              }}>
              <View>
                <View
                  style={{
                    alignSelf: "flex-end",
                  }}>
                  <SvgXml xml={isDark ? globeDark : globe} />
                </View>

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}>
                  <View>
                    <LinearGradient
                      colors={["#7A7A7A", "#E0E0E0"]}
                      style={{
                        width: 66,
                        height: 63,
                        borderRadius: 24.63,
                        padding: 1,
                      }}>
                      <LinearGradient
                        colors={["#F1C40F", "#E67E22"]}
                        style={{
                          flex: 1,
                          borderRadius: 24.63,
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Image
                          source={{
                            uri: `https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg`,
                          }}
                          width={50}
                          height={47.76}
                          resizeMode="cover"
                          style={{
                            borderRadius: 18.66,
                          }}
                        />
                      </LinearGradient>
                    </LinearGradient>
                    <View
                      style={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        pointerEvents: "none",
                      }}>
                      <LinearGradient
                        colors={["#F4C842", "#F4C842"]}
                        style={{
                          height: 20,
                          borderRadius: 9,
                          padding: 4,
                        }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 10,
                          }}>
                          Lvl 2
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: isDark ? "#fff" : "#333333",
                      fontSize: 20,
                      fontWeight: "semibold",
                      textAlign: "center",
                    }}>
                    Easin arafat
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#A5A5A5" : "#888",
                      fontSize: 14,
                      textAlign: "center",
                    }}>
                    easinarafat.jp@gmail.com
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <LinearGradient
                  colors={
                    isDark ? ["#E2B74D", "#C89D2F"] : ["#FFFFFF", "#FFFFFF"]
                  }
                  style={{
                    width: "48%",
                    borderWidth: 1,
                    borderColor: isDark ? "#333333" : "#E0E0E0",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingBottom: 12,
                    paddingTop: 28,
                  }}>
                  <View style={{}}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "medium",
                          color: isDark ? "#ffff" : "#333333",
                        }}>
                        Balance
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: isDark ? "#009C42" : "#4CAF50",
                          }}>
                          1000k
                        </Text>
                        <View>
                          <SvgXml xml={coin} />
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "medium",
                          color: isDark ? "#774900" : "#757575",
                        }}>
                        Expire 12/11/2025
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                <LinearGradient
                  colors={
                    isDark ? ["#1C1C1C", "#292929"] : ["#FFFFFF", "#FFFFFF"]
                  }
                  style={{
                    width: "48%",
                    borderWidth: 1,
                    borderColor: isDark ? "#333333" : "#E0E0E0",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingBottom: 12,
                    paddingTop: 28,
                  }}>
                  <View style={{}}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "medium",
                          color: isDark ? "#ffff" : "#333333",
                        }}>
                        Bonus
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: isDark ? "#F39C12" : "#FF7043",
                          }}>
                          100
                        </Text>
                        <View>
                          <SvgXml xml={coin} />
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "medium",
                          color: isDark ? "#E74C3C" : "#E53935",
                        }}>
                        {timeLeft !== "Expired"
                          ? `Expires in: ${timeLeft}`
                          : "Expired"}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => router.push("/main/setting/recharge")}>
                  <LinearGradient
                    colors={["#2ECC71", "#3498DB"]}
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      padding: 3,
                    }}>
                    <LinearGradient
                      colors={
                        isDark ? ["#F39C12", "#E67E22"] : ["#FFA726", "#FF7043"]
                      }
                      start={{ x: 0, y: 0 }} // Starting point (left)
                      end={{ x: 1, y: 0 }} // Ending point (right)
                      style={{
                        gap: 5,
                        borderRadius: 12,
                        padding: 12,
                      }}>
                      <View>
                        <View>
                          <SvgXml xml={coin} width={34.48} height={36} />
                        </View>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 32,
                            fontWeight: "medium",
                            color: "#FFFFFF",
                          }}>
                          Recharge coin
                        </Text>
                      </View>
                    </LinearGradient>
                  </LinearGradient>
                </TouchableOpacity>

                <View
                  style={{
                    gap: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}>
                  {settingOptions?.map((item, i) => {
                    return (
                      <TouchableOpacity
                        style={{
                          width: "48%",
                        }}>
                        <LinearGradient
                          key={i}
                          colors={
                            isDark
                              ? ["#1A1A1A", "#1A1A1A"]
                              : ["#FFFFFF", "#FFFFFF"]
                          }
                          style={{
                            borderWidth: 1,
                            borderColor: isDark ? "#333333" : "#E0E0E0",
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                          }}>
                          <View
                            style={{
                              gap: 38,
                            }}>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}>
                              {item?.leftIcon}
                              {item?.rightIcon}
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: isDark ? "#FFFFFF" : "#341010",
                                }}>
                                {item?.title}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 22,
                }}>
                {socialLinks?.map((item, i) => {
                  return (
                    <TouchableOpacity>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: isDark ? "#333333" : "#E0E0E0",
                          borderRadius: 100,
                          width: 44,
                          aspectRatio: 1 / 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <SvgXml xml={item?.svg} width={24} height={24} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}
