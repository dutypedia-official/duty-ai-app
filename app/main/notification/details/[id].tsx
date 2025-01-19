import NotiCommentCard from "@/components/notif/commentCard";
import Comments from "@/components/notif/comments";
import MdxContent from "@/components/notif/mdxContent";
import NotiInput from "@/components/notif/notiInput";
import { SafeAreaView, Text, useThemeColor } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Markdown from "react-native-markdown-display";
import { ActivityIndicator, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [likeByMe, setLikeByMe] = useState(false);
  const [dislikeByMe, setDislikeByMe] = useState(false);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        `/noti/get-analysis-new/${params?.id}`,
        token,
        {},
        mainServerAvailable
      );
      setTotalComments(data.totalComments);
      setData(data?.analysis);
      setTotalLikes(data.totalLikes);
      setLikeByMe(data.likedByMe);
      setDislikeByMe(data.dislikedByMe);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const giveReaction = async (type: "Like" | "Dislike") => {
    try {
      const token = await getToken();
      await client.post(
        `/noti/give/reaction`,
        {
          analysisId: params?.id,
          reaction: type,
        },
        token,
        {},
        mainServerAvailable
      );
      // setRefreash(!refreash);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params?.id, isFocused, refreash]);

  const logoUrl = `https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg`;

  const comment = `Ei keywords gulo diye Dribbble, Behance, ba Figma Community te khujle bhalo result pabe. Figma CommunityEi keywords gulo diye Dribbble, Behance, ba Figma Community te khujle bhalo result pabe. Figma CommunityEi keywords gulo diye Dribbble, Behance, ba Figma Community te khujle bhalo result pabe. Figma CommunityEi keywords gulo diye Dribbble, Behance, ba Figma Community te khujle bhalo result pabe. Figma Community`;

  const isNeg = data?.changePer?.startsWith("-");

  if (loading || !data) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#171B26" : "#FFFFFF",
        }}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? "#FFFFFF" : "#171B26"}
        />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={400}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          zIndex: 999,
          paddingTop: insets.top + 10,
          backgroundColor: isDark ? "#171B26" : "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 10,
          paddingHorizontal: 12,
          gap: 25,
        }}
      >
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
          }}
        >
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
          }}
        >
          {data?.companyName}
        </Text>
        <View style={{ backgroundColor: "transparent", width: 36 }}></View>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          backgroundColor: isDark ? "#171B26" : "#FFFFFF",
          height: "100%",
          flex: 1,
        }}
      >
        <StatusBar backgroundColor={isDark ? "#171B26" : "#FFFFFF"} />

        <View
          style={{
            backgroundColor: "transparent",
            height: "100%",
            marginTop: Platform.OS === "ios" ? insets.top : insets.top + 64,
          }}
        >
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
          <View
            style={{
              flex: 1,
            }}
          >
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
                }}
              >
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
                  }}
                >
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
                        }}
                      >
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
                            }}
                          >
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

              <View
                style={{
                  backgroundColor: "transparent",
                  gap: 24,
                }}
              >
                <Pressable
                  onPress={() => setExpanded(!expanded)}
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
                    flexDirection: "row",
                    flexWrap: "wrap",
                    // gap: 16,
                    paddingHorizontal: 12,
                    flex: 1,
                  }}
                >
                  <MdxContent data={data} expanded={expanded} />
                </Pressable>

                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 12,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 100,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            paddingLeft: 12,
                            paddingRight: 8,
                            paddingVertical: 8,
                          }}
                          onPress={() => {
                            if (!likeByMe) {
                              setTotalLikes(totalLikes + 1);
                            } else {
                              setTotalLikes(
                                totalLikes > 0 ? totalLikes - 1 : 0
                              );
                            }
                            giveReaction("Like");
                            setLikeByMe(!likeByMe);
                            setDislikeByMe(false);
                          }}
                        >
                          <AntDesign
                            name={likeByMe ? "like1" : "like2"}
                            size={20}
                            color={isDark ? "white" : "#999999"}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 16,
                            color: isDark ? "white" : "#999999",
                            marginRight: 12,
                          }}
                        >
                          {totalLikes}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 1.5,
                          height: "50%",
                          backgroundColor: "white",
                        }}
                      ></View>
                      <TouchableOpacity
                        onPress={() => {
                          if (likeByMe) {
                            setTotalLikes(
                              totalLikes > 0 ? totalLikes - 1 : totalLikes
                            );
                          }
                          setDislikeByMe(!dislikeByMe);
                          setLikeByMe(false);
                          giveReaction("Dislike");
                        }}
                        style={{
                          paddingRight: 12,
                          paddingLeft: 12,
                          paddingVertical: 8,
                        }}
                      >
                        <AntDesign
                          name={dislikeByMe ? "dislike1" : "dislike2"}
                          size={20}
                          color={isDark ? "white" : "#999999"}
                          style={{
                            transform: [{ scaleX: -1 }],
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        backgroundColor: isDark ? "#F2F2F2" : "#F6F6F6",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.2,
                        pointerEvents: "none",
                      }}
                    ></View>
                  </View>
                  <TouchableOpacity
                    style={{
                      borderRadius: 100,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        color: isDark ? "white" : "#999999",
                      }}
                    >
                      {totalComments} Comments
                    </Text>
                    <View
                      style={{
                        backgroundColor: isDark ? "#F2F2F2" : "#F6F6F6",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.2,
                      }}
                    ></View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: "transparent",
                    marginHorizontal: 12,
                    gap: 24,
                    paddingBottom: insets.bottom + 40,
                  }}
                >
                  <NotiInput analysisId={data?.id} />
                  <Comments analysisId={data?.id} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
