import { SafeAreaView } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

const SignalList = ({
  name,
  logoUrl,
  item,
}: {
  name: any;
  logoUrl: any;
  item: any;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";
  const cardBgColor = isDark ? "#1E1E1E" : "#EAEDED";

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
          opacity: 1,
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
              onPress={() => {
                router.push({
                  pathname: "/main/portfolio/buy-stock/[id]",
                  params: {
                    id: item?.id,
                    stockItem: JSON.stringify(item),
                  },
                });
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
                style={{
                  borderRadius: 36,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: "#8B7500",
                    }}>
                    {isBn ? "কিনুন" : "Buy"}
                  </Text>
                  <FontAwesome name="angle-right" size={20} color="#8B7500" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

export const BuyStockList = () => {
  const { mainServerAvailable } = useUi();
  const isFocused = useIsFocused();
  const [marketData, setMarketData] = useState<any>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBgColor = isDark ? "#1E1E1E" : "#EAEDED";
  const client = apiClient();

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const { data: mData } = await client.get(
        "/tools/get-stock-market-bd/1",
        null,
        {},
        mainServerAvailable
      );
      setMarketData(mData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const filterData = marketData?.filter((stock: any) =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          source={require("@/assets/images/golden-stock-bg-light.png")}
        />
      )}
      <View
        style={{
          position: "relative",
          backgroundColor: "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
          gap: 28,
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
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            paddingHorizontal: 10,
          }}>
          <LinearGradient
            colors={isDark ? ["#333333", "#0F0F0F"] : ["#FFD700", "#F0F2F5"]}
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
      </View>

      <View style={{ flex: 1, gap: 24, paddingVertical: 10 }}>
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
                ListEmptyComponent={() => {
                  if (loadingData) {
                    return (
                      <View
                        style={{
                          backgroundColor: "transparent",
                          padding: 12,
                          height: Dimensions.get("window").height,
                        }}>
                        <View>
                          <ActivityIndicator />
                        </View>
                      </View>
                    );
                  }
                  return (
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
                  );
                }}
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
};
