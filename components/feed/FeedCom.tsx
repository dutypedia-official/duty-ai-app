import { apiClient } from "@/lib/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import WebView from "react-native-webview";
import { SafeAreaView, Text, useThemeColor, View } from "../Themed";
import { LinearGradient } from "expo-linear-gradient";
import useFeedData from "@/lib/hooks/useFeedData";
import useUi from "@/lib/hooks/useUi";

export default function FeedCom() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(true);
  const { refreash, setRefreash, screenRefresh, setScreenRefresh } = useUi();
  const { indexData, setIndexData } = useFeedData();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const videoAspectRatio = 16 / 9;
  const router = useRouter();
  const videoUrl = "https://www.youtube.com/embed/eJdW7-zZCnU?autoplay=1";
  const translateX = useSharedValue(0);
  const client = apiClient();
  const bgColor = isDark ? "#1A1A1A" : "#F5F5F5";

  const fetchData = async (init: boolean = true) => {
    try {
      const { data } = await client.get(`/tools/get-dsebd-index`);
      setIndexData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    translateX.value = withTiming(index * Dimensions.get("window").width, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -translateX.value }],
  }));

  const tabs = [
    {
      tabName: "DSEX",
      data: [
        {
          title: "Value",
          subtitle: "Current index value",
          value: indexData?.dseXIndex[0],
          icon: <MaterialIcons name="show-chart" size={20} color="white" />,
        },
        {
          title: "Num change",
          subtitle: "Numeric change in value",
          value: indexData?.dseXIndex[1],
          icon: (
            <FontAwesome6
              name="arrow-right-arrow-left"
              size={20}
              color="white"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          ),
        },
        {
          title: "Change",
          subtitle: "Percentage change",
          value: indexData?.dseXIndex[2],
          icon: (
            <MaterialCommunityIcons
              name="brightness-percent"
              size={20}
              color="white"
            />
          ),
        },
      ],
    },
    {
      tabName: "DSES",
      data: [
        {
          title: "Value",
          subtitle: "Current index value",
          value: indexData?.dseSIndex[0],
          icon: <MaterialIcons name="show-chart" size={20} color="white" />,
        },
        {
          title: "Num change",
          subtitle: "Numeric change in value",
          value: indexData?.dseSIndex[1],
          icon: (
            <FontAwesome6
              name="arrow-right-arrow-left"
              size={20}
              color="white"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          ),
        },
        {
          title: "Change",
          subtitle: "Percentage change",
          value: indexData?.dseSIndex[2],
          icon: (
            <MaterialCommunityIcons
              name="brightness-percent"
              size={20}
              color="white"
            />
          ),
        },
      ],
    },
    {
      tabName: "DS30",
      data: [
        {
          title: "Value",
          subtitle: "Current index value",
          value: indexData?.ds30Index[0],
          icon: <MaterialIcons name="show-chart" size={20} color="white" />,
        },
        {
          title: "Num change",
          subtitle: "Numeric change in value",
          value: indexData?.ds30Index[1],
          icon: (
            <FontAwesome6
              name="arrow-right-arrow-left"
              size={20}
              color="white"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          ),
        },
        {
          title: "Change",
          subtitle: "Percentage change",
          value: indexData?.ds30Index[2],
          icon: (
            <MaterialCommunityIcons
              name="brightness-percent"
              size={20}
              color="white"
            />
          ),
        },
      ],
    },
  ];

  const overviewData = [
    {
      title: "Total Trade",
      subtitle: "Total number of shares traded today",
      value: indexData?.totalTrade,
    },
    {
      title: "Total Volume",
      subtitle: "Total shares bought and sold today",
      value: indexData?.totalVolume,
    },
    {
      title: "Total Value in Taka",
      subtitle: "Total money spent on trades today",
      value: indexData?.totalValue,
    },
    {
      title: "Issues Advanced",
      subtitle: "Number of issues that have increased in value",
      value: indexData?.issuesAdvanced,
    },
    {
      title: "Issues Declined",
      subtitle: "Number of issues that have decreased in value",
      value: indexData?.issuesDeclined,
    },
    {
      title: "Issues Unchanged",
      subtitle: "Number of issues with no change in value",
      value: indexData?.issuesUnchanged,
    },
  ];

  const TabContentArea = ({ item }: { item: any }) => {
    const isNeg = item?.value?.startsWith("-");

    return (
      <View>
        <View
          style={{
            width: Dimensions.get("window").width - 48,
            backgroundColor: "transparent",
            flexDirection: "row",
            gap: 8,
          }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: isDark ? "#1E2A53" : "#492B7B",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {item?.icon}
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 4,
                backgroundColor: "transparent",
              }}>
              <Text style={{ fontSize: 14 }}>{item?.title}</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isNeg ? "red" : isDark ? "#00FF7F" : "#00BA1E",
                }}>
                {item?.value}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: "#787878" }}>
              {item?.subtitle}
            </Text>
          </View>
        </View>
      </View>
    );
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

  // const onRefresh = useCallback(() => {
  //   setScreenRefresh(true);
  //   setTimeout(() => {
  //     setScreenRefresh(false);
  //   }, 2000);
  // }, []);

  return (
    // <SafeAreaView
    //   edges={["top", "left", "right"]}
    //   style={{
    //     flex: 1,
    //     marginTop: 0,
    //   }}>
    <SafeAreaView>
      <ScrollView
      // refreshControl={
      //   <RefreshControl refreshing={refreash} onRefresh={onRefresh} />
      // }
      >
        <View style={styles.container}>
          {/* <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
            style={styles.videoContainer}>
            <Image
              style={{
                height: 140,
                width: Dimensions.get("window").width,
                position: "absolute",
                backgroundColor: "#07010B",
              }}
              resizeMode="cover"
              source={require("../../assets/images/videoBackground.png")}
            />
            <View style={styles.videoOverlay}>
              <View
                style={{
                  backgroundColor: "transparent",
                  width: Dimensions.get("window").width / 2,
                }}>
                <Text
                  lightColor="white"
                  darkColor="#B0B0B0"
                  style={styles.videoOperlayTitle}>
                  {indexData?.docsTitle ||
                    "Duty AI এর ব্যাবহার জানতে ভিডিও টি দেখুন"}
                </Text>
                <Text
                  lightColor="white"
                  darkColor="white"
                  style={styles.videoOperlaySub}>
                  {indexData?.docsUpdatedAt || "সর্বশেষ আপডেট 8 jul 2021"}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                  width: Dimensions.get("window").width / 2,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <MaterialIcons name="smart-display" size={40} color="#FF1414" />
              </View>
            </View>
          </TouchableOpacity> */}
          {/* <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={
                {
                  // paddingHorizontal: 12,
                }
              }>
              <View
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").height * 0.85,
                  backgroundColor: isDark ? "black" : "white",
                }}>
                {loading && (
                  <View
                    style={
                      {
                        // width: Dimensions.get("window").width - 24,
                        // height: Dimensions.get("window").width / videoAspectRatio,
                      }
                    }>
                    <ActivityIndicator
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </View>
                )}
                <WebView
                  style={{
                    height: Dimensions.get("window").width,
                    flex: 1,
                    backgroundColor: isDark ? "black" : "white",
                  }}
                  onLoadStart={() => setLoading(true)}
                  onLoad={() => setLoading(false)}
                  onLoadEnd={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  javaScriptEnabled={true}
                  allowsFullscreenVideo={true}
                  source={{
                    uri: indexData?.docsUrl || videoUrl,
                  }}
                  domStorageEnabled={true}
                  mediaPlaybackRequiresUserAction={false}
                  injectedJavaScript={injectedJavaScript}
                  onMessage={(event) => {
                    if (
                      Platform.OS === "android" &&
                      event.nativeEvent.data === "enterFullScreen"
                    ) {
                      setVisible(false);
                      setTimeout(() => setVisible(true), 0);
                    }
                  }}
                />
              </View>
            </Modal>
          </Portal> */}

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
                  {tabs?.map((item: any, i: number) => {
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
                      <View
                        key={i}
                        style={{
                          width: Dimensions.get("window").width * 0.38,
                          aspectRatio: 1036 / 1184,
                          borderRadius: 12,
                          position: "relative",
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
                              {item?.tabName}
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
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            {/* <View
              style={{
                paddingBottom: 24,
              }}>
              <View style={{ gap: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    gap: 8,
                    backgroundColor: isDark ? "#0F1021" : "#F5F5F5",
                    borderRadius: 4,
                  }}>
                  {tabs?.map((item, i) => {
                    const active = i === activeTabIndex;
                    return (
                      <Pressable
                        key={i}
                        onPress={() => handleTabPress(i)}
                        style={{
                          backgroundColor: active
                            ? isDark
                              ? "#1E2A53"
                              : "#492B7B"
                            : "transparent",
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          borderRadius: 4,
                          width: Dimensions.get("window").width / 3.5,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            textAlign: "center",
                            color: active
                              ? "white"
                              : isDark
                              ? "white"
                              : "black",
                          }}>
                          {item?.tabName}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Animated.View
                  style={[
                    {
                      width: Dimensions.get("screen").width * 3,
                      flexDirection: "row",
                      paddingLeft: 12,
                    },
                    animatedStyle,
                  ]}>
                  {tabs?.map((tabData, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          width: Dimensions.get("screen").width,
                          gap: 24,
                        }}>
                        {tabData?.data?.map((item, id) => {
                          return <TabContentArea key={id} item={item} />;
                        })}
                      </View>
                    );
                  })}
                </Animated.View>
              </View>
            </View> */}
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
                    Market Overview
                  </Text>
                </View>
                <View style={{ backgroundColor: "transparent", gap: 19 }}>
                  {overviewData?.map((item, i) => {
                    return (
                      <View
                        key={i}
                        style={{ backgroundColor: "transparent", gap: 4 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 4,
                            backgroundColor: "transparent",
                          }}>
                          <Text style={{ fontSize: 14 }}>{item?.title}</Text>
                          <Text style={{ fontSize: 14 }}>{item?.value}</Text>
                        </View>
                        <Text style={{ fontSize: 10, color: "#787878" }}>
                          {item?.subtitle}
                        </Text>
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
                {/* <View
                  style={{
                    backgroundColor: "transparent",
                    paddingVertical: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/main/discover/",
                        params: { redirectToList: "yes" },
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 8,
                      paddingVertical: 12,
                      backgroundColor: bgColor,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: isDark ? "#181745" : "#E9E9E9",
                    }}>
                    <Text style={{ fontSize: 16 }}>
                      Explore Stocks with Duty AI
                    </Text>
                    <View style={{ backgroundColor: "transparent" }}>
                      <AntDesign
                        name="arrowright"
                        size={15}
                        color={isDark ? "white" : "black"}
                      />
                    </View>
                  </TouchableOpacity>
                </View> */}
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
