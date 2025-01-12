import {
  SafeAreaView,
  Text,
  useThemeColor,
  View,
} from "@/components-jp/Themed";
import { apiClient } from "@/lib/api";
import useFeedData from "@/lib/hooks/useFeedData";
import useUi from "@/lib/hooks/useUi";
import { useUser } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedCom() {
  const { user } = useUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { refreash, setRefreash, screenRefresh, setScreenRefresh } = useUi();
  const { indexData, setIndexData } = useFeedData();
  const client = apiClient();
  const bgColor = isDark ? "#1A1A1A" : "#F5F5F5";
  const [activeSlide, setActiveSlide] = useState("NI225");
  const borderColor = useThemeColor({}, "border");
  const [loading, setLoading] = useState(true);
  const inset = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const fetchData = async (init: boolean = true) => {
    try {
      const { data } = await client.get(`/tools/get-jp-index`);
      setIndexData(data);
      // console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredIndex = indexData?.overview?.find(
    (item: any) => item?.name === activeSlide
  );

  const onSlideChange = (slideName: string) => {
    setActiveSlide(slideName);
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const injectedJavaScript = `
    document.getElementsByTagName('video')[0].play();
    var iframe = document.querySelector('iframe');
    iframe.requestFullscreen();
  `;

  // const onRefresh = useCallback(() => {
  //   setScreenRefresh(true);
  //   setTimeout(() => {
  //     setScreenRefresh(false);
  //   }, 2000);
  // }, []);

  const titleMap: any = {
    change: "1 day",
    "Perf.1M": "1 month",
    "Perf.5D": "5 days",
    "Perf.5Y": "5 years",
    "Perf.6M": "6 months",
    "Perf.All": "All time",
    "Perf.W": "1 week",
    "Perf.Y": "1 year",
    "Perf.YTD": "Year to date",
  };

  // Custom sort order
  const sortOrder = [
    "change",
    "1 week",
    "1 month",
    "6 months",
    "1 year",
    "5 years",
    "All time",
    "Year to date",
  ];

  const newData = Object.entries(filteredIndex?.overview || {})
    .map(([key, value]) => ({
      title: titleMap[key] || key, // Use titleMap or default to the key
      value: value !== undefined ? [value] : [0], // Default to 0 if value is undefined
    }))
    .filter((item) => item.title !== "Year to date" && item.title !== "1 week"); // Exclude "Year to date"

  // Sort the array based on the custom order
  newData.sort(
    (a, b) => sortOrder.indexOf(a.title) - sortOrder.indexOf(b.title)
  );

  const formatChange = (value: number) => {
    return Math.abs(value).toFixed(2); // Absolute value and round to 2 decimal places
  };

  if (!user) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: isDark ? "#0f0f0f" : "#F0F2F5",
        flex: 1,
      }}>
      <ScrollView
      // refreshControl={
      //   <RefreshControl refreshing={refreash} onRefresh={onRefresh} />
      // }
      >
        <View style={styles.container}>
          {loading ? (
            <View
              style={{
                flex: 1,
                height:
                  Dimensions.get("screen").height -
                  inset.top -
                  inset.bottom -
                  80,
                backgroundColor: "transparent",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
              }}>
              <ActivityIndicator
                size="small"
                color={isDark ? "#00B0FF" : "#34495E"}
              />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: isDark ? "#0f0f0f" : "#F0F2F5",
                position: "relative",
                zIndex: 1,
                paddingHorizontal: 12,
                paddingVertical: 24,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                width: Dimensions.get("window").width,
              }}>
              <View
                style={{
                  paddingBottom: 20,
                  gap: 20,
                  backgroundColor: "transparent",
                }}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    paddingHorizontal: 8,
                  }}>
                  <Text style={{ fontSize: 20 }}>インデックス</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      width: "100%",
                      height: "100%",
                      flexDirection: "row",
                      gap: 12,
                      paddingBottom: 5,
                      alignItems: "flex-start",
                      alignSelf: "flex-start",
                    }}>
                    {loading &&
                      Array.from({ length: 4 }).map((_, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              width: Dimensions.get("window").width * 0.38,
                              aspectRatio: 1036 / 1184,
                              backgroundColor: bgColor,
                              alignItems: "center",
                              alignContent: "center",
                              justifyContent: "center",
                            }}></View>
                        );
                      })}
                    {indexData?.overview?.map((item: any, i: number) => {
                      const isNeg = item?.overview?.change < 0;

                      const getIntegerPart = (value: number | string) => {
                        const strValue = value?.toString() || "";
                        return strValue.split(".")[0];
                      };

                      const getDecimalPart = (value: number | string) => {
                        const strValue = value?.toString() || "";
                        const decimalPart = strValue.split(".")[1];
                        return decimalPart ? decimalPart.substring(0, 2) : "";
                      };

                      return (
                        <TouchableOpacity
                          onPress={() => onSlideChange(item?.name)}
                          key={i}
                          style={{
                            width: Dimensions.get("window").width * 0.38,
                            aspectRatio: 1036 / 1184,
                            borderRadius: 12,
                            position: "relative",
                            borderWidth: 1,
                            borderColor:
                              activeSlide === item?.name
                                ? borderColor
                                : "transparent",
                          }}>
                          <Image
                            style={{
                              height: "100%",
                              width: "100%",
                              position: "absolute",
                              borderRadius: 12,
                            }}
                            resizeMode="cover"
                            source={
                              isNeg
                                ? isDark
                                  ? require("../../assets/images/negative-dark.png")
                                  : require("../../assets/images/negative-light.png")
                                : isDark
                                ? require("../../assets/images/positive-dark.png")
                                : require("../../assets/images/positive-light.png")
                            }
                          />
                          <View
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              backgroundColor: "transparent",
                              width: "100%",
                              height: "100%",
                              gap: 8,
                              paddingLeft: 8,
                              paddingRight: 8,
                              paddingTop: 12,
                            }}>
                            <View
                              style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}>
                              <Text style={{ fontSize: 12, color: "#6E6E6E" }}>
                                {item?.name}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: isNeg ? "#FF0000" : "#20E5FF",
                                }}>
                                <AntDesign
                                  name={isNeg ? "arrowdown" : "arrowup"}
                                  size={12}
                                  color={isNeg ? "#FF0000" : "#20E5FF"}
                                />
                                {isNeg &&
                                  "-" +
                                    formatChange(item?.overview?.change) +
                                    "%"}
                              </Text>
                            </View>
                            <Text style={{ fontSize: 16 }}>
                              {getIntegerPart(
                                indexData?.technical?.find(
                                  (fitem: any) => fitem?.name === item?.name
                                )?.technical?.close
                              )}
                              {"."}
                              <Text style={{ color: "#6E6E6E" }}>
                                {getDecimalPart(
                                  indexData?.technical?.find(
                                    (fitem: any) => fitem?.name === item?.name
                                  )?.technical?.close
                                )}
                              </Text>
                            </Text>
                            {/* <Text style={{ fontSize: 12, color: "#6E6E6E" }}>
                              {getIntegerPart(item?.data?.[1]?.value) +
                                "." +
                                getDecimalPart(item?.data?.[1]?.value)}
                            </Text> */}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <View style={{ gap: 20, backgroundColor: "transparent" }}>
                <View
                  style={{
                    padding: 12,
                    gap: 19,
                    backgroundColor: bgColor,
                    borderRadius: 8,
                  }}>
                  <View style={{ backgroundColor: "transparent" }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                      インデックスパフォーマンス
                    </Text>
                  </View>
                  <View style={{ backgroundColor: "transparent", gap: 19 }}>
                    {loading ? (
                      <View
                        style={{
                          flex: 1,
                          height: 300,
                          backgroundColor: bgColor,
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                        }}>
                        <ActivityIndicator
                          size="small"
                          color={isDark ? "#00B0FF" : "#34495E"}
                        />
                      </View>
                    ) : (
                      newData?.map((item: any, i: number) => {
                        const isNeg = item?.value < 0;
                        // Replace English words in the title with Japanese equivalents
                        const translateTitle = (title: string) => {
                          return title
                            .replace(/days?/, "日") // Matches "day" or "days"
                            .replace(/months?/, "カ月") // Matches "month" or "months"
                            .replace(/years?/, "年") // Matches "year" or "years"
                            .replace(/weeks?/, "週") // Matches "week" or "weeks"
                            .replace(/All time/, "全期間");
                        };
                        return (
                          <View
                            key={i}
                            style={{ backgroundColor: "transparent", gap: 4 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 4,
                                backgroundColor: "transparent",
                                flex: 1,
                                justifyContent: "space-between",
                              }}>
                              <View
                                style={{
                                  backgroundColor: "transparent",
                                  width: "40%",
                                  justifyContent: "center",
                                }}>
                                <Text style={{ fontSize: 14 }}>
                                  {translateTitle(item?.title)}
                                </Text>
                              </View>

                              <View
                                style={{
                                  backgroundColor: "transparent",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 4,
                                  width: "20%",
                                  height: 40,
                                }}>
                                <Image
                                  source={
                                    isNeg
                                      ? require("@/assets/images/indexPerNeg.png")
                                      : require("@/assets/images/indexPerPos.png")
                                  }
                                  resizeMethod="resize"
                                  resizeMode="contain"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    alignSelf: "center",
                                  }}
                                />
                              </View>
                              <View
                                style={{
                                  width: "40%",
                                  backgroundColor: "transparent",
                                  alignItems: "flex-end",
                                  justifyContent: "center",
                                  paddingRight: 12,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: isNeg
                                      ? "#FF0000"
                                      : isDark
                                      ? "#FFFFFF"
                                      : "#34495E",
                                  }}>
                                  {formatChange(item?.value) + "%"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
                <View
                  style={{
                    paddingTop: indexData?.summary ? 12 : 0,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: bgColor,
                  }}>
                  {indexData?.summary && (
                    <View
                      style={{
                        backgroundColor: "transparent",
                        gap: 12,
                      }}>
                      <Text
                        style={{ fontSize: 16 }}
                        lightColor="#3DC000"
                        darkColor="#FFD700">
                        AI サマリー
                      </Text>
                      <Text
                        style={{ fontSize: 14, paddingBottom: 20 }}
                        darkColor="#C0C0C0"
                        lightColor="#424242">
                        {indexData?.summary}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    height: 116,
    backgroundColor: "#000",
    padding: 12,
  },
  videoOverlay: {
    backgroundColor: "transparent",
    position: "relative",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoOperlayTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  videoOperlaySub: {
    fontSize: 12,
    fontWeight: "normal",
  },
});
