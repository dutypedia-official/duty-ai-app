import { SafeAreaView } from "@/components/Themed";
import useVipSignal from "@/lib/hooks/useVipSignal";
import { slugify } from "@/lib/utils";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function Win() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  const { answer, setAnswer } = useVipSignal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { clearSelectStock } = useVipSignal();
  // const [confettiKey, setConfettiKey] = useState(0);
  const [halfwayDone, setHalfwayDone] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      // Prevent default back behavior
      e.preventDefault();

      if (pathname.includes("/main/home")) {
        router.push("/main/home/");
      } else {
        // Navigate to the discover screen
        router.push("/main/discover/");
      }
    });

    // Cleanup the listener on component unmount
    return unsubscribe;
  }, [navigation, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHalfwayDone(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const specific = (details: any) =>
    answer.stocks.find((stock: any) => stock.name === details);

  return (
    <LinearGradient
      colors={isDark ? ["#121212", "#000000"] : ["#F0F2F5", "#F0F2F5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, position: "relative" }}>
      {/* <ConfettiCannon
        key={confettiKey}
        count={500}
        origin={{ x: 0, y: 0 }}
        fadeOut={true}
        autoStart={true}
        autoStartDelay={0}
        // explosionSpeed={350}
        fallSpeed={3000}
      /> */}

      {halfwayDone && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            aspectRatio: 1,
          }}>
          <Image
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            resizeMode="cover"
            source={
              isDark
                ? require("@/assets/images/confetti-dark.png")
                : require("@/assets/images/confetti-light.png")
            }
          />
        </View>
      )}

      <LottieView
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: "100%",
          marginTop: "-20%",
        }}
        source={require("@/assets/animations/confetti.json")}
        autoPlay
        loop={false}
      />
      <LottieView
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: "100%",
          marginTop: "20%",
        }}
        source={require("@/assets/animations/confetti.json")}
        autoPlay
        loop={false}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={{ paddingHorizontal: 10 }}>
          <View
            style={{
              backgroundColor: "transparent",
              borderRadius: 12,
              shadowColor: isDark ? "transparent" : "#9B9B9B",
              shadowOffset: {
                width: 0,
                height: 8,
              },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
              flexDirection: "row",
              marginTop: 80,
            }}>
            <LinearGradient
              colors={isDark ? ["#D1D5DB", "#A6A9AD"] : ["#FFFFFF", "#FFFFFF"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                paddingVertical: 24,
                paddingHorizontal: 8,
                backgroundColor: "transparent",
                width: "30%",
                gap: 20,
              }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 38,
                    aspectRatio: 1,
                    borderRadius: 100,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    position: "relative",
                    borderWidth: 2.3,
                    borderColor: isDark ? "#FFFFFF" : "#CBCBCB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      backgroundColor: "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: 0,
                      top: 0,
                    }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 14,
                        color: "#1E1E1E",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {answer?.leaderboard["2nd"]?.stock[0]}
                    </Text>
                  </View>
                  {answer?.leaderboard["2nd"]?.stock && (
                    <SvgUri
                      uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["2nd"].stock}.svg`}
                      width={38}
                      height={38}
                      style={{
                        backgroundColor: "transparent",
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: isDark ? "#8B7500" : "#FFD700",
                      fontWeight: "bold",
                    }}>
                    {answer?.leaderboard["2nd"]?.stock}
                  </Text>

                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#777777",
                      fontSize: 10,
                    }}>
                    {answer?.leaderboard["2nd"].score} point
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: isDark ? "#C0C0C0" : "#EFEBEB",
                    paddingHorizontal: 5,
                    borderRadius: 100,
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: isDark ? "#FFFFFF" : "#8B7500",
                    }}>
                    2nd
                  </Text>
                </View>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={isDark ? ["#8B0000", "#4A0202"] : ["#F0F2F5", "#FFF3B0"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 24,
                paddingHorizontal: 8,
                backgroundColor: "transparent",
                width: "40%",
                gap: 20,
                overflow: "visible",
              }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                <View
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",
                    width: 83,
                    aspectRatio: isDark ? 720 / 894 : 720 / 868,
                    marginTop: isDark ? -84 : -80,
                  }}>
                  <Image
                    source={
                      isDark
                        ? require("@/assets/images/winner-dark.png")
                        : require("@/assets/images/winner-light.png")
                    }
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                </View>

                <View
                  style={{
                    marginTop: -80,
                    backgroundColor: "transparent",
                    width: 53,
                    aspectRatio: 1,
                    borderRadius: 100,
                    overflow: "hidden",
                  }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#1E1E1E",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: 17,
                    }}>
                    {answer?.leaderboard["1st"]?.stock[0]}
                  </Text>

                  {answer?.leaderboard["1st"]?.stock && (
                    <SvgUri
                      uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["1st"].stock}.svg`}
                      width={53}
                      height={53}
                    />
                  )}
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 20,
                  }}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: isDark ? "#FFD700" : "#8B7500",
                      fontWeight: "bold",
                    }}>
                    {answer?.leaderboard["1st"]?.stock}
                  </Text>

                  <Text
                    style={{
                      fontWeight: "bold",
                      color: isDark ? "#FFFFFF" : "#777777",
                      fontSize: 10,
                    }}>
                    {answer?.leaderboard["1st"].score} point
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: isDark ? "#E80000" : "#FAE773",
                    paddingHorizontal: 5,
                    borderRadius: 100,
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: isDark ? "#fff" : "#8B7500",
                    }}>
                    1st
                  </Text>
                </View>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={isDark ? ["#D1D5DB", "#A6A9AD"] : ["#FFFFFF", "#FFFFFF"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
                paddingVertical: 24,
                paddingHorizontal: 8,
                backgroundColor: "transparent",
                width: "30%",
                gap: 20,
              }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 38,
                    aspectRatio: 1,
                    borderRadius: 100,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    position: "relative",
                    borderWidth: 2.3,
                    borderColor: isDark ? "#FFFFFF" : "#CBCBCB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      backgroundColor: "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      left: 0,
                      top: 0,
                    }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 14,
                        color: "#1E1E1E",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {answer?.leaderboard["3rd"]?.stock[0]}
                    </Text>
                  </View>
                  {answer?.leaderboard["3rd"]?.stock && (
                    <SvgUri
                      uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["3rd"].stock}.svg`}
                      width={38}
                      height={38}
                      style={{
                        backgroundColor: "transparent",
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: isDark ? "#8B7500" : "#FFD700",
                      fontWeight: "bold",
                    }}>
                    {answer?.leaderboard["3rd"]?.stock}
                  </Text>

                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#777777",
                      fontSize: 10,
                    }}>
                    {answer?.leaderboard["3rd"]?.score} point
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: isDark ? "#C0C0C0" : "#EFEBEB",
                    paddingHorizontal: 5,
                    borderRadius: 100,
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: isDark ? "#FFFFFF" : "#8B7500",
                    }}>
                    3rd
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 48,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              position: "relative",
              aspectRatio: 1,
            }}>
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="contain"
              source={
                isDark
                  ? require("@/assets/images/leaderboard-dark.png")
                  : require("@/assets/images/leaderboard-light.png")
              }
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            flex: 1,
          }}>
          <View
            style={{
              paddingHorizontal: 10,
              borderRadius: 12,
              shadowColor: isDark ? "transparent" : "#9B9B9B",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 6,
            }}>
            <View
              style={{
                backgroundColor: "transparent",
              }}>
              <View
                style={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}>
                <LinearGradient
                  colors={["#FFD700", "#F0F2F5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      width: "65%",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        position: "relative",
                      }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          left: 0,
                          top: 0,
                        }}>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 12,
                            color: "#1E1E1E",
                          }}>
                          {answer?.leaderboard["1st"]?.stock[0]}
                        </Text>
                      </View>
                      {answer?.leaderboard["1st"]?.stock && (
                        <SvgUri
                          uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["1st"]?.stock}.svg`}
                          width={24}
                          height={24}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{
                          fontWeight: "normal",
                          color: "#8B7500",
                          fontSize: 14,
                        }}>
                        {answer?.leaderboard["1st"]?.stock}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        backgroundColor: "transparent",
                        position: "relative",
                        aspectRatio: 720 / 964,
                      }}>
                      <Image
                        source={require("@/assets/images/winner.png")}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                          objectFit: "contain",
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (pathname.includes("/main/home")) {
                          router.push({
                            pathname: `/main/home/vipsignal/list/${slugify(
                              answer?.leaderboard["1st"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["1st"]?.stock
                                ),
                                name: answer?.leaderboard["1st"]?.stock,
                              }),
                            },
                          });
                        } else {
                          router.push({
                            pathname: `/main/discover/vipsignal/list/${slugify(
                              answer?.leaderboard["1st"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["1st"]?.stock
                                ),
                                name: answer?.leaderboard["1st"]?.stock,
                              }),
                            },
                          });
                        }
                      }}
                      style={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: isDark ? "#B08D57" : "#D4AF37",
                        borderRadius: 36,
                      }}>
                      <LinearGradient
                        colors={["transparent", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 36 }}>
                        <Text
                          style={{
                            color: "#8B7500",
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                          }}>
                          View
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
            <LinearGradient
              colors={isDark ? ["#A9A9A9", "#D3D3D3"] : ["#FFD700", "#F0F2F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 1 }}></LinearGradient>
            <View
              style={{
                backgroundColor: "transparent",
              }}>
              <View>
                <LinearGradient
                  colors={
                    isDark ? ["#D3D3D3", "#A9A9D3"] : ["#F5F5F5", "#F5F5F5"]
                  }
                  start={isDark ? { x: 1, y: 0 } : { x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      width: "65%",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        position: "relative",
                      }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          left: 0,
                          top: 0,
                        }}>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 12,
                            color: "#1E1E1E",
                          }}>
                          {answer?.leaderboard["2nd"]?.stock[0]}
                        </Text>
                      </View>

                      {answer?.leaderboard["2nd"]?.stock && (
                        <SvgUri
                          uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["2nd"]?.stock}.svg`}
                          width={24}
                          height={24}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{
                          fontWeight: "normal",
                          color: isDark ? "#F0F0F0" : "#6B6B6B",
                          fontSize: 14,
                        }}>
                        {answer?.leaderboard["2nd"]?.stock}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        backgroundColor: "transparent",
                        position: "relative",
                        aspectRatio: 720 / 964,
                      }}></View>
                    <TouchableOpacity
                      onPress={() => {
                        if (pathname.includes("/main/home")) {
                          router.push({
                            pathname: `/main/home/vipsignal/list/${slugify(
                              answer?.leaderboard["2nd"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["2nd"]?.stock
                                ),
                                name: answer?.leaderboard["2nd"]?.stock,
                              }),
                            },
                          });
                        } else {
                          router.push({
                            pathname: `/main/discover/vipsignal/list/${slugify(
                              answer?.leaderboard["2nd"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["2nd"]?.stock
                                ),
                                name: answer?.leaderboard["2nd"]?.stock,
                              }),
                            },
                          });
                        }
                      }}
                      style={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: isDark ? "#B08D57" : "#D4AF37",
                        borderRadius: 36,
                      }}>
                      <LinearGradient
                        colors={["transparent", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 36 }}>
                        <Text
                          style={{
                            color: "#8B7500",
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                          }}>
                          View
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <LinearGradient
              colors={isDark ? ["#A9A9A9", "#D3D3D3"] : ["#FFD700", "#F0F2F5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 1 }}></LinearGradient>
            <View
              style={{
                backgroundColor: "transparent",
              }}>
              <View
                style={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}>
                <LinearGradient
                  colors={
                    isDark ? ["#D3D3D3", "#A9A9D3"] : ["#F5F5F5", "#F5F5F5"]
                  }
                  start={isDark ? { x: 1, y: 0 } : { x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                      width: "65%",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        position: "relative",
                      }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          left: 0,
                          top: 0,
                        }}>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 12,
                            color: "#1E1E1E",
                          }}>
                          {answer?.leaderboard["3rd"]?.stock?.[0]}
                        </Text>
                      </View>

                      {answer?.leaderboard["3rd"]?.stock && (
                        <SvgUri
                          uri={`https://s3-api.bayah.app/cdn/symbol/logo/${answer?.leaderboard["3rd"]?.stock}.svg`}
                          width={24}
                          height={24}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{
                          fontWeight: "normal",
                          color: isDark ? "#F0F0F0" : "#6B6B6B",
                          fontSize: 14,
                        }}>
                        {answer?.leaderboard["3rd"]?.stock}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 100,
                        backgroundColor: "transparent",
                        position: "relative",
                        aspectRatio: 720 / 964,
                      }}></View>
                    <TouchableOpacity
                      onPress={() => {
                        if (pathname.includes("/main/home")) {
                          router.push({
                            pathname: `/main/home/vipsignal/list/${slugify(
                              answer?.leaderboard["3rd"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["3rd"]?.stock
                                ),
                                name: answer?.leaderboard["3rd"]?.stock,
                              }),
                            },
                          });
                        } else {
                          router.push({
                            pathname: `/main/discover/vipsignal/list/${slugify(
                              answer?.leaderboard["3rd"]?.stock
                            )}`,
                            params: {
                              data: JSON.stringify({
                                details: specific(
                                  answer?.leaderboard["3rd"].stock
                                ),
                                name: answer?.leaderboard["3rd"].stock,
                              }),
                            },
                          });
                        }
                      }}
                      style={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: isDark ? "#B08D57" : "#D4AF37",
                        borderRadius: 36,
                      }}>
                      <LinearGradient
                        colors={["transparent", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 36 }}>
                        <Text
                          style={{
                            color: "#8B7500",
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                          }}>
                          View
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            // height: 82,
            width: Dimensions.get("window").width,
            position: "relative",
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (pathname.includes("/main/home")) {
                router.push("/main/home/");
              } else {
                router.push("/main/discover/");
              }
              console.log("cancel");
            }}
            style={{
              shadowColor: "#9B9B9B",
              shadowOffset: {
                width: 0,
                height: 0.5,
              },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}>
            <LinearGradient
              colors={["#F6B253", "#FF9500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 1,
                borderRadius: 100,
              }}>
              <LinearGradient
                colors={["#F6B253", "#FF9500"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 100 }}>
                <Text
                  style={{
                    opacity: 0.7,
                    color: isDark ? "white" : "#FFFFFF",
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 12,
                    textAlign: "center",
                  }}>
                  Cancel
                </Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
