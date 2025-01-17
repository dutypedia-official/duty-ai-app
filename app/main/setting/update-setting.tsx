import { coin } from "@/assets/icons/coin";
import { email, email_dark } from "@/assets/icons/email";
import { exit, exit_dark } from "@/assets/icons/exit";
import { globe, globeDark } from "@/assets/icons/globe";
import { setting_bg_light } from "@/assets/icons/setting_bg_light";
import { fb, file, shield, yt } from "@/assets/icons/socials";
import { trash, trash_dark } from "@/assets/icons/trash";
import LowBalance from "@/components/low-balance";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { differenceInSeconds } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
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
  const [alertBalance, setAlertBalance] = useState(false);

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
      leftIcon: (
        <View>
          <SvgXml xml={isDark ? email_dark : email} width={24} height={24} />
        </View>
      ),
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-50deg" }],
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
            transform: [{ rotate: "-50deg" }],
          }}
        />
      ),
      title: "Recharge History",
    },
    {
      leftIcon: (
        <SvgXml xml={isDark ? trash_dark : trash} width={24} height={24} />
      ),
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-50deg" }],
          }}
        />
      ),
      title: "Delete account",
    },
    {
      leftIcon: (
        <SvgXml xml={isDark ? exit_dark : exit} width={24} height={24} />
      ),
      rightIcon: (
        <FontAwesome
          name="angle-right"
          size={24}
          color="#E2B74D"
          style={{
            transform: [{ rotate: "-50deg" }],
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
    <ScrollView
      style={{
        backgroundColor: bgColor,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
          }}>
          <Image
            source={require("@/assets/images/setting_bg_light.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
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
                <TouchableOpacity
                  style={{
                    width: "48%",
                  }}>
                  <LinearGradient
                    colors={
                      isDark ? ["#E2B74D", "#C89D2F"] : ["#FFE6E6", "#FFE6E6"]
                    }
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? "#333333" : "#E0E0E0",
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 16,
                    }}>
                    <View
                      style={{
                        gap: 10,
                      }}>
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
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setAlertBalance(true)}
                  style={{
                    width: "48%",
                  }}>
                  <LinearGradient
                    colors={
                      isDark ? ["#1C1C1C", "#292929"] : ["#FFFFFF", "#FFFFFF"]
                    }
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? "#333333" : "#E0E0E0",
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 16,
                    }}>
                    <View
                      style={{
                        gap: 10,
                      }}>
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
                </TouchableOpacity>
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
                        key={i}
                        style={{
                          width: "48%",
                        }}>
                        <LinearGradient
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
                    <TouchableOpacity key={i}>
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

      <LowBalance open={alertBalance} setOpen={setAlertBalance} />
    </ScrollView>
  );
}
