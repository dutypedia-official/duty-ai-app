import { SafeAreaView, useThemeColor } from "@/components/Themed";
import useStockData from "@/lib/hooks/useStockData";
import useVipSignal from "@/lib/hooks/useVipSignal";
import { Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import Toast from "react-native-toast-message";
import WebView from "react-native-webview";

const SignalList = ({
  name,
  logoUrl,
  item,
  maxLength,
  index,
}: {
  name: any;
  logoUrl: any;
  item: any;
  maxLength: number;
  index: number;
}) => {
  const router = useRouter();
  const { setSelectStock, removeSelectStock, selectStock } = useVipSignal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBgColor = isDark ? "#1E1E1E" : "#EAEDED";

  const selecteStockFn = (item: any) => () => {
    const { symbol } = item;

    // Check if the stock is already selected
    if (selectStock.includes(symbol)) {
      // Remove the stock if already selected
      removeSelectStock(symbol);

      Toast.show({
        type: "info",
        text1: `${symbol} has been removed from selection`,
      });
    } else {
      // Limit selection to 3 stocks
      if (selectStock.length >= 3) {
        Toast.show({
          type: "error",
          text1: "You can select only 3 stocks",
        });
        return;
      }

      // Add the stock if not already selected
      setSelectStock(symbol);

      Toast.show({
        type: "success",
        text1: `You have selected ${symbol}`,
      });
    }
  };

  const isSelected = selectStock.includes(item?.symbol);

  return (
    <View
      style={{
        backgroundColor: "transparent",
      }}>
      <LinearGradient
        colors={isDark ? ["#23290E", "#1E1E1E"] : ["#FFD700", "#F0F2F5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          opacity: selectStock.length >= 3 && !isSelected ? 0.2 : 1,
        }}>
        <LinearGradient
          colors={isDark ? ["#171717", "#0D0D0D"] : [cardBgColor, cardBgColor]}
          start={{ x: 0, y: 0 }}
          end={isDark ? { x: 0, y: 1 } : { x: 1, y: 0 }}
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
                    fontSize: 12,
                    color: "#1E1E1E",
                  }}>
                  {name?.[0]}
                </Text>
              </View>
              {logoUrl && (
                <SvgUri
                  uri={logoUrl}
                  width={24}
                  height={24}
                  style={{
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </View>
            <View>
              <Text>
                <Text
                  style={{
                    fontWeight: "normal",
                    color: isDark ? "#F0F0F0" : "#6B6B6B",
                    fontSize: 14,
                  }}>
                  {name}
                </Text>
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={selecteStockFn(item)}
              style={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: isDark ? "#B08D57" : "#D4AF37",
                borderRadius: 36,
              }}>
              <LinearGradient
                colors={
                  isSelected
                    ? ["#FFD700", "#F0F2F5"]
                    : ["transparent", "transparent"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 36 }}>
                <Text
                  style={{
                    color: "#8B7500",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}>
                  Select
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const Signal = () => {
  const { selectStock } = useVipSignal();
  const [searchTerm, setSearchTerm] = React.useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const cardBgColor = isDark ? "#1E1E1E" : "#EAEDED";
  const graDient = isDark ? ["#333333", "#0F0F0F"] : ["#FFD700", "#F0F2F5"];
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoUrl = "https://www.youtube.com/embed/eJdW7-zZCnU?autoplay=1";
  const pathname = usePathname();
  const router = useRouter();
  const { marketData, setMarketData } = useStockData();

  const filterData = marketData?.filter((stock: any) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const isDisable = selectStock.length < 3 ? true : false;

  const injectedJavaScript = `
    document.getElementsByTagName('video')[0].play();
    var iframe = document.querySelector('iframe');
    iframe.requestFullscreen();
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <StatusBar translucent={true} backgroundColor="transparent" />

      {!isDark && (
        <Image
          style={{
            flex: 1,
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
            position: "absolute",
          }}
          resizeMode="cover"
          source={require("../../../../../assets/images/golden-stock-bg-light.png")}
        />
      )}
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
            backgroundColor: isDark ? "#1E1E1E" : "#E9E9E9",
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
              style={{ color: isDark ? "#FFFFFF" : "#311919" }}
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
            color: isDark ? "#FFD700" : "#366000",
          }}>
          Select 3 stock
        </Text>
        <View style={{ backgroundColor: "transparent", width: 36 }}></View>
      </View>

      <Portal>
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
                uri: videoUrl,
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
      </Portal>
      <View style={{ flex: 1, gap: 24, paddingTop: 10 }}>
        <View style={{ backgroundColor: "transparent", paddingHorizontal: 10 }}>
          <LinearGradient
            colors={graDient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 100,
              padding: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: cardBgColor,
                padding: 12,
                borderRadius: 100,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Feather name="search" size={20} color={"#8B7500"} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#8B7500",
                  height: "100%",
                  paddingLeft: 12,
                  paddingVertical: 0,
                }}
                placeholder="Search by stock name"
                placeholderTextColor={"#8B7500"}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
          </LinearGradient>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            flex: 1,
          }}>
          <LinearGradient
            colors={isDark ? ["#333333", "#0F0F0F"] : ["#FFD700", "#F0F2F5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              borderRadius: 12,
            }}>
            <View
              style={{
                flex: 1,
                padding: 1,
                overflow: "hidden",
                borderRadius: 14,
              }}>
              <FlashList
                estimatedItemSize={60}
                contentContainerStyle={{
                  backgroundColor: isDark ? "#0D0D0D" : "#F5F5F5",
                }}
                data={filterData}
                renderItem={({ item }) => (
                  <SignalList
                    item={item}
                    maxLength={filterData?.length}
                    index={filterData?.indexOf(item)}
                    name={item?.symbol}
                    logoUrl={`https://s3-api.bayah.app/cdn/symbol/logo/${item?.symbol}.svg`}
                  />
                )}
                keyExtractor={(item: any) => item?.symbol}
                ItemSeparatorComponent={() => (
                  <LinearGradient
                    colors={
                      isDark ? ["#23290E", "#1E1E1E"] : ["#FFD700", "#F0F2F5"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 1 }}></LinearGradient>
                )}
                ListEmptyComponent={
                  <View
                    style={{
                      backgroundColor: "transparent",
                      padding: 12,
                      height: Dimensions.get("window").height,
                    }}>
                    <View>
                      <Text
                        style={{
                          color: isDark ? "#F0F0F0" : "#6B6B6B",
                          fontSize: 16,
                          textAlign: "center",
                        }}>
                        No stock found
                      </Text>
                    </View>
                  </View>
                }
              />
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            backgroundColor: "transparent",
            // height: 82,
            width: Dimensions.get("window").width,
            position: "relative",
            paddingHorizontal: 10,
            paddingVertical: 10,
            gap: 12,
          }}>
          <TouchableOpacity
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Pressable
              onPress={() => {
                setVisible(true);
              }}
              style={{
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text
                style={{ color: isDark ? "#FFD700" : "#366000", fontSize: 14 }}>
                ভিডিও টি দেখুন
              </Text>
              <AntDesign
                name="play"
                size={16}
                color={isDark ? "#F5F5F5" : "#333333"}
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isDisable) {
                Toast.show({
                  type: "error",
                  text1: "Please select 3 stocks",
                });
                return;
              }
              router.push("/main/discover/vipsignal/list/processing");
            }}
            style={{
              shadowColor: isDark ? "transparent" : "#9B9B9B",
              shadowOffset: {
                width: 0,
                height: 0.5,
              },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 6,
            }}>
            <LinearGradient
              colors={isDark ? ["#FFD700", "#F0F2F5"] : ["#F6B253", "#FF9500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 1,
                borderRadius: 100,
                opacity:
                  Platform.OS === "android"
                    ? isDisable
                      ? isDark
                        ? 1
                        : 0.3
                      : 1
                    : isDark
                    ? isDisable
                      ? 0.15
                      : 1
                    : isDisable
                    ? 0.3
                    : 1,
              }}>
              <LinearGradient
                colors={
                  isDark ? ["#333333", "#0F0F0F"] : ["#F6B253", "#FF9500"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 100,
                  opacity: 1,
                }}>
                <Text
                  style={{
                    color: isDark
                      ? isDisable
                        ? "#FFD700"
                        : "#FFD700"
                      : "#FFFFFF",
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 12,
                    textAlign: "center",
                    opacity:
                      Platform.OS === "android"
                        ? isDisable
                          ? isDark
                            ? 0.15
                            : 1
                          : 1
                        : 1,
                  }}>
                  {isDark ? "Start processing" : "Start"}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signal;
