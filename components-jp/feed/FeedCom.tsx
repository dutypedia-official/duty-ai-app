import { apiClient } from "@/lib/api";
import useFeedData from "@/lib/hooks/useFeedData";
import useUi from "@/lib/hooks/useUi";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView, Text, useThemeColor, View } from "../Themed";

export default function FeedCom() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { refreash, setRefreash, screenRefresh, setScreenRefresh } = useUi();
  const { indexData, setIndexData } = useFeedData();
  const client = apiClient();
  const bgColor = isDark ? "#1A1A1A" : "#F5F5F5";
  const [activeSlide, setActiveSlide] = useState("DSEX");
  const borderColor = useThemeColor({}, "border");

  const fetchData = async (init: boolean = true) => {
    try {
      const { data } = await client.get(`/tools/get-dsebd-index`);
      setIndexData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const slides = [
    {
      name: "DSEX",
      index: [
        {
          title: "1 Day",
          value: "0.32%",
        },
        {
          title: "5 Day",
          value: "-0.36%",
        },
        {
          title: "1 month",
          value: "-1.7%",
        },
        {
          title: "6 year",
          value: "1.2%",
        },
        {
          title: "1 year",
          value: "2.8%",
        },
        {
          title: "5 year year",
          value: "3.1%",
        },
      ],
      data: [
        {
          value: indexData?.dseXIndex[0],
        },
        {
          value: indexData?.dseXIndex[1],
        },
        {
          value: indexData?.dseXIndex[2],
        },
      ],
    },
    {
      name: "DSES",
      index: [
        {
          title: "1 Day",
          value: "2.8%",
        },
        {
          title: "5 Day",
          value: "0.36%",
        },
        {
          title: "1 month",
          value: "-1.7%",
        },
        {
          title: "6 year",
          value: "-1.2%",
        },
        {
          title: "1 year",
          value: "2.8%",
        },
        {
          title: "5 year year",
          value: "3.1%",
        },
      ],
      data: [
        {
          value: indexData?.dseSIndex[0],
        },
        {
          value: indexData?.dseSIndex[1],
        },
        {
          value: indexData?.dseSIndex[2],
        },
      ],
    },
    {
      name: "DS30",
      index: [
        {
          title: "1 Day",
          value: "0.8%",
        },
        {
          title: "5 Day",
          value: "-0.86%",
        },
        {
          title: "1 month",
          value: "-2.7%",
        },
        {
          title: "6 year",
          value: "-1.2%",
        },
        {
          title: "1 year",
          value: "2.8%",
        },
        {
          title: "5 year year",
          value: "-8%",
        },
      ],
      data: [
        {
          value: indexData?.ds30Index[0],
        },
        {
          value: indexData?.ds30Index[1],
        },
        {
          value: indexData?.ds30Index[2],
        },
      ],
    },
  ];

  const filteredIndex =
    slides?.find((item) => item?.name === activeSlide)?.index || [];

  const onSlideChange = (slideName: string) => {
    setActiveSlide(slideName);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 600000); // 600000 ms = 10 minutes

    return () => clearInterval(intervalId);
  }, []);

  const injectedJavaScript = `
    document.getElementsByTagName('video')[0].play();
    var iframe = document.querySelector('iframe');
    iframe.requestFullscreen();
  `;

  const onRefresh = useCallback(() => {
    setScreenRefresh(true);
    setTimeout(() => {
      setScreenRefresh(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreash} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
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
                <Text style={{ fontSize: 20 }}>Index</Text>
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
                  {slides?.map((item: any, i: number) => {
                    const isNeg = item?.data?.[2]?.value?.startsWith("-");

                    const getIntegerPart = (value: any) => {
                      return value && typeof value === "string"
                        ? value.split(".")[0]
                        : "";
                    };

                    const getDecimalPart = (value: any) => {
                      if (value && typeof value === "string") {
                        const decimalPart = value.split(".")[1];
                        return decimalPart ? decimalPart.substring(0, 2) : "";
                      }
                      return "";
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
                              {getIntegerPart(item?.data?.[2]?.value) +
                                "." +
                                getDecimalPart(item?.data?.[2]?.value) +
                                "%"}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 16 }}>
                            {getIntegerPart(item?.data?.[0]?.value)}
                            {item?.data?.[0]?.value &&
                              typeof item?.data?.[0]?.value === "string" &&
                              item?.data?.[0]?.value.split(".")[1] &&
                              "."}
                            <Text style={{ color: "#6E6E6E" }}>
                              {getDecimalPart(item?.data?.[0]?.value)}
                            </Text>
                          </Text>
                          <Text style={{ fontSize: 12, color: "#6E6E6E" }}>
                            {getIntegerPart(item?.data?.[1]?.value) +
                              "." +
                              getDecimalPart(item?.data?.[1]?.value)}
                          </Text>
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
                    Index Performance
                  </Text>
                </View>
                <View style={{ backgroundColor: "transparent", gap: 19 }}>
                  {filteredIndex?.map((item, i) => {
                    const isNeg = item?.value?.startsWith("-");

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
                            <Text style={{ fontSize: 14 }}>{item?.title}</Text>
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
                              {item?.value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
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
                      Ai summery
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
