import { bar_chart_svg } from "@/assets/svgs/bar_chart_svg";
import { Bd_flag } from "@/assets/svgs/bg_flag";
import { Candles_SVG } from "@/assets/svgs/candles_svg";
import { Glob_SVG } from "@/assets/svgs/glob_svg";
import { Jp_flag } from "@/assets/svgs/jp_flag";
import { SafeAreaView, useThemeColor } from "@/components-jp/Themed";
import useLang from "@/lib/hooks/useLang";
import useMarket from "@/lib/hooks/useMarket";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

export default function Market() {
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const router = useRouter();
  const { language } = useLang();
  const { selectMarket, setSelectMarket } = useMarket();

  const angleInDegrees = 157;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  const start = {
    x: 0.5 - Math.cos(angleInRadians) / 2,
    y: 0.5 - Math.sin(angleInRadians) / 2,
  };

  const end = {
    x: 0.5 + Math.cos(angleInRadians) / 2,
    y: 0.5 + Math.sin(angleInRadians) / 2,
  };

  const markets = [
    {
      flag: Jp_flag,
      country: "Japan",
      name: "日本市場",
      total: "24,640.89",
      percentage: "+118.00(+0.30%)",
      language: "Jp",
    },
    {
      flag: Bd_flag,
      country: "Bangladesh",
      name: "ঢাকা স্টক এক্সচেঞ্জ",
      total: "24,640.89",
      percentage: "+118.00(+0.30%)",
      language: "Bn",
    },
  ];

  const sortedMarkets = markets.sort((a, b) => {
    if (language === "Jp") {
      return a.language === "Jp" ? -1 : 1;
    } else if (language === "Bn" || language === "En") {
      return a.language === "Bn" ? -1 : 1;
    }
    return 0;
  });

  return (
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
        {/* bg gradient */}
        <LinearGradient
          colors={["#1D114D", "#110E28"]}
          start={{ x: 0.25, y: 0 }}
          end={{ x: 1, y: 0.75 }}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 100,
          flex: 1,
          width: Dimensions.get("screen").width,
          height:
            Dimensions.get("screen").height -
            Dimensions.get("screen").height * 0.2,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <SvgXml
          xml={Candles_SVG}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <StatusBar style="light" />

      <Stack.Screen
        options={{
          headerShown: false,
          title: "Market",
          headerStyle: {
            backgroundColor: bgColor,
          },
        }}
      />

      <View
        style={{
          position: "absolute",
          zIndex: 1000, // Ensure back button is on top
        }}>
        <View
          style={{
            top: insets.top,
            position: "relative",
            backgroundColor: "transparent",
            marginLeft: 20,
            paddingVertical: 10,
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
              colors={["#6A00F4", "#A4508B"]}
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
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            paddingTop: 48,
            backgroundColor: "transparent",
          }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
            <SvgXml
              xml={Glob_SVG}
              width={Dimensions.get("screen").width * 0.6}
              height={Dimensions.get("screen").height * 0.1}
            />
          </View>
          <View
            style={{
              marginTop: Dimensions.get("screen").height * 0.01,
            }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                lineHeight: 40,
                textAlign: "center",
                fontWeight: "600",
                marginVertical: 22,
              }}>
              {language === "Jp"
                ? "分析する市場を選択してください"
                : "Select Market for Analysis"}
            </Text>
          </View>
          <View
            style={{
              gap: 24,
              marginBottom: 24,
            }}>
            {sortedMarkets?.map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectMarket(item.country);
                  }}
                  style={{
                    borderWidth: 2,
                    borderColor:
                      selectMarket === item?.country
                        ? "#BFABFF"
                        : "transparent",
                    borderRadius: 12,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <LinearGradient
                    colors={["#1A1D34", "#2F345C"]}
                    start={start}
                    end={end}
                    style={{
                      borderRadius: 12,
                      width: "100%",
                      paddingVertical: 24,
                      paddingRight: 24,
                      paddingLeft: 12,
                    }}>
                    <View
                      style={{
                        gap: 24,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}>
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                          <SvgXml xml={item.flag} />
                        </View>
                        <View style={{ gap: 6 }}>
                          <Text
                            style={{
                              fontSize: 20,
                              color: "#ECECEC",
                              fontWeight: "700",
                            }}>
                            {item.country}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: "#ECECEC",
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <View
                          style={{
                            gap: 7,
                          }}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: "#DADADA",
                            }}>
                            {item?.total}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: "#DADADA",
                            }}>
                            {item?.percentage}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 70,
                          }}>
                          <SvgXml xml={bar_chart_svg} />
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Pressable
          disabled={selectMarket === "" ? true : false}
          onPress={() =>
            language === "Jp"
              ? router.push("/(start-jp)/login")
              : router.push("/(start)/login")
          }
          style={{
            paddingBottom: 16,
          }}>
          <LinearGradient
            colors={
              selectMarket === ""
                ? ["#4F5A5F", "#3A3D3F"]
                : ["#FF6FD8", "#00FFC6"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 2,
              borderRadius: 100,
              opacity: 1,
            }}>
            <LinearGradient
              colors={
                selectMarket === ""
                  ? ["#4F5A5F", "#3A3D3F"]
                  : ["#FF6FD8", "#973FCD", "#3813C2"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ borderRadius: 100, opacity: 0.8 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingVertical: 16,
                  textAlign: "center",
                  color: selectMarket === "" ? "#717171" : "#FFD700",
                }}>
                {language === "Jp"
                  ? "次"
                  : language === "Bn"
                  ? "পরবর্তী"
                  : "Next"}
              </Text>
            </LinearGradient>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});
