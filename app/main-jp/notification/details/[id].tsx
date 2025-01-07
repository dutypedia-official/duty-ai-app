import { SafeAreaView, Text, useThemeColor } from "@/components-jp/Themed";
import { apiClient } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { ActivityIndicator, Portal } from "react-native-paper";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import ImageViewer from "react-native-image-zoom-viewer";

export default function NotiDetails() {
  const { getToken } = useAuth();
  const client = apiClient();
  const isFocused = useIsFocused();
  const [data, setData] = useState<any>([]);
  const { refreash, setRefreash, mainServerAvailable } = useUi();
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const params = useLocalSearchParams();
  const pathname = usePathname();
  console.log("path----------------------", pathname);
  const borderColor = useThemeColor({}, "border");

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        `/noti/get-analysis/${params?.id}`,
        token,
        {},
        mainServerAvailable
      );
      // console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.id, isFocused]);

  const isNeg = data?.changePer?.startsWith("-");

  if (loading || !data) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#171B26" : "#FFFFFF",
        }}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#FFFFFF" : "#171B26"}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: isDark ? "#171B26" : "#FFFFFF",
      }}>
      <StatusBar backgroundColor={isDark ? "#171B26" : "#FFFFFF"} />
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
          gap: 25,
        }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 50,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            width: 36,
            height: 36,
          }}>
          <Text>
            <Ionicons
              name="chevron-back"
              size={24}
              style={{ color: "#311919" }}
            />
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
          }}>
          {data?.companyName}
        </Text>
        <View style={{ backgroundColor: "transparent", width: 36 }}></View>
      </View>
      <View
        style={{
          backgroundColor: "transparent",
          height: "100%",
        }}>
        <Portal>
          <Modal visible={visible} transparent={true} onDismiss={hideModal}>
            <TouchableWithoutFeedback onPress={hideModal}>
              <ImageViewer
                renderIndicator={() => {
                  return <></>;
                }} // Hides the image count indicator
                imageUrls={[
                  {
                    url: isDark ? data?.photoDark : data?.photoLight,
                  },
                ]}
                enableSwipeDown={true}
                onSwipeDown={hideModal}
                enableImageZoom={true}
                loadingRender={() => (
                  <ActivityIndicator
                    size="small"
                    color={isDark ? "#FFFFFF" : "#000000"}
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      top: "50%",
                      zIndex: 2,
                    }}
                  />
                )}
                backgroundColor="rgba(0, 0, 0, 0.8)"
              />

              {/* <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 200,
                elevation: 5,
              }}>
              <View style={{}}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    width: "100%",
                    aspectRatio: 296 / 260,
                  }}>
                  <Image
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      alignSelf: "center",
                      borderRadius: 12,
                    }}
                    resizeMode="contain"
                    source={{
                      uri: isDark ? data?.photoDark : data?.photoLight,
                    }}
                  />
                </View>
              </View>
            </View> */}
            </TouchableWithoutFeedback>
          </Modal>
        </Portal>
        <View>
          <ScrollView style={{ height: "86%" }}>
            <View style={{ backgroundColor: "transparent", gap: 32 }}>
              {data?.photoLight && data?.photoDark && (
                <Image
                  style={{
                    height: Dimensions.get("window").height,
                    width: Dimensions.get("window").width,
                    position: "absolute",
                    borderRadius: 12,
                    transform: [{ translateX: 0 }, { translateY: 50 }],
                  }}
                  resizeMode="cover"
                  source={
                    isDark
                      ? require("../../../../assets/images/grid-dark.png")
                      : require("../../../../assets/images/grid-light.png")
                  }
                />
              )}
              <View
                style={{
                  gap: 8,
                  paddingHorizontal: 12,
                  paddingTop: 32,
                  backgroundColor: "transparent",
                }}>
                <Text style={{ fontSize: 20 }}>{data?.companyName}</Text>
                {data?.price && (
                  <>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                      ৳ {data?.price}
                    </Text>

                    <Text style={{ fontSize: 16, fontWeight: "normal" }}>
                      Today{" "}
                      <Text style={{ color: isNeg ? "#FF0000" : "#2ECC71" }}>
                        {data?.changePer}
                      </Text>
                    </Text>
                  </>
                )}

                <Text style={{ fontSize: 12 }}>
                  {new Date(data?.createdAt).toDateString()}
                </Text>
              </View>
              {data?.photoLight && data?.photoDark && (
                <View
                  style={{
                    position: "relative",
                    backgroundColor: "transparent",
                  }}>
                  <View style={{ paddingVertical: 10 }}>
                    {loading2 && (
                      <ActivityIndicator
                        size="small"
                        color={isDark ? "#FFFFFF" : "#000000"}
                        style={{
                          position: "absolute",
                          alignSelf: "center",
                          top: "50%",
                          zIndex: 2,
                        }}
                      />
                    )}

                    {!loading2 && (
                      <Image
                        style={{
                          width: Dimensions.get("screen").width,
                          height: Dimensions.get("screen").height,
                          aspectRatio: 860 / 760,
                          position: "absolute",
                          alignSelf: "center",
                          top: -240,
                          left: 0,
                        }}
                        resizeMode="cover"
                        source={
                          isDark
                            ? require("../../../../assets/images/shadow-dark.png")
                            : require("../../../../assets/images/shadow-light.png")
                        }
                      />
                    )}
                    <View style={{ paddingHorizontal: 10 }}>
                      <Pressable
                        onPress={showModal}
                        style={{
                          position: "relative",
                          aspectRatio: 360 / 260,
                          width: "100%",
                        }}>
                        <Image
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            alignSelf: "center",
                            borderRadius: 12,
                            borderWidth: !isDark ? 2 : 0,
                            borderColor: !isDark ? "#eaeaea" : "transparent",
                          }}
                          resizeMode="cover"
                          source={
                            isDark
                              ? { uri: data?.photoDark }
                              : { uri: data?.photoLight }
                          }
                          onLoadStart={() => setLoading2(true)}
                          onLoadEnd={() => setLoading2(false)}
                        />
                        {!loading2 && (data?.photoLight || data?.photoDark) && (
                          <View
                            style={{
                              backgroundColor: "transparent",
                              zIndex: 1,
                              position: "absolute",
                              bottom: 20,
                              right: 20,
                            }}>
                            <Pressable onPress={showModal}>
                              <FontAwesome6
                                name="expand"
                                size={24}
                                color={isDark ? "#FFFFFF" : "#5F5F5F"}
                              />
                            </Pressable>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ backgroundColor: "transparent" }}>
                <Pressable
                  onLongPress={async () => {
                    await Clipboard.setStringAsync(data?.content);
                    Toast.show({
                      type: "success",
                      text1: "Copied to clipboard",
                      visibilityTime: 2000,
                      position: "top",
                    });
                  }}
                  style={{
                    gap: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}>
                  <Markdown
                    style={{
                      body: {
                        color: !isDark ? "#4C4C4C" : "#E0E0E0",
                        fontSize: 14,
                      },
                      // Headings
                      heading1: {
                        fontSize: 24,
                        fontWeight: "bold",
                        marginVertical: 10,
                      },
                      heading2: {
                        fontSize: 22,
                        fontWeight: "bold",
                        marginVertical: 8,
                      },
                      heading3: {
                        fontSize: 20,
                        fontWeight: "bold",
                        marginVertical: 6,
                      },
                      heading4: {
                        fontSize: 18,
                        fontWeight: "bold",
                        marginVertical: 5,
                      },
                      heading5: {
                        fontSize: 16,
                        fontWeight: "bold",
                        marginVertical: 4,
                      },
                      heading6: {
                        fontSize: 14,
                        fontWeight: "bold",
                        marginVertical: 3,
                      },
                      // Lists
                      bullet_list: { marginVertical: 5 },
                      ordered_list: { marginVertical: 5 },
                      list_item: { marginVertical: 3, flexDirection: "row" },
                      bullet_list_icon: {
                        marginRight: 5,
                      },
                      ordered_list_icon: {
                        marginRight: 5,
                      },
                      // Code
                      code_inline: {
                        fontFamily: "monospace",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        borderRadius: 3,
                        paddingHorizontal: 4,
                      },
                      fence: {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: 5,
                        padding: 10,
                        marginVertical: 5,
                      },
                      // Table
                      table: {
                        borderWidth: 1,
                        borderColor: borderColor,
                        marginVertical: 10,
                      },
                      tr: {
                        borderBottomWidth: 1,
                        borderColor: borderColor,
                      },
                      th: {
                        fontWeight: "bold",
                        padding: 5,
                        borderRightWidth: 1,
                        borderColor: borderColor,
                      },
                      td: {
                        padding: 5,
                        borderRightWidth: 1,
                        borderColor: borderColor,
                      },
                      // Blockquote
                      blockquote: {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        borderLeftWidth: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginVertical: 5,
                      },
                      // Horizontal rule
                      hr: {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        height: 1,
                        marginVertical: 10,
                      },
                    }}>
                    {data?.content}
                  </Markdown>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
