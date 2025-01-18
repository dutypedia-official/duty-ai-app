import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import React, { Fragment } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { FlashList } from "@shopify/flash-list";
import PortfolioList from "./portfolioList";
import { FlatList } from "react-native-gesture-handler";

export default function StockPortfolio() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const portfolioData = [
    {
      id: "387yueyre",
      symbol: "JMISMDL",
      buyPrice: "3893843",
      currentPrice: "889343",
      change: "-8.8764",
    },
    {
      id: "idufyueyre",
      symbol: "WY",
      buyPrice: "3893843",
      currentPrice: "8893843",
      change: "-8.8764",
    },
    {
      id: "lk7yuey74re",
      symbol: "JMISMDL",
      buyPrice: "3893843",
      currentPrice: "8393843",
      change: "-8.8764",
    },
    {
      id: "idueir343ufyueyre",
      symbol: "AY",
      buyPrice: "3893843",
      currentPrice: "8893847",
      change: "-8.8764",
    },
    {
      id: "lk7yu34y74re",
      symbol: "GP",
      buyPrice: "3893843",
      currentPrice: "56843",
      change: "-8.8764",
    },
    {
      id: "lk7yu34y74re",
      symbol: "ROBI",
      buyPrice: "93843",
      currentPrice: "83830",
      change: "-8.8764",
    },
  ];

  return (
    <View>
      <View
        style={{
          marginHorizontal: 12,
          gap: 16,
        }}>
        <View style={{}}>
          <Text
            style={{
              color: isDark ? "#FFFFFF" : "#1A202C",
            }}>
            Stock Portfolio
          </Text>
        </View>
        <View
          style={{
            gap: 24,
          }}>
          <View
            style={{
              backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
              padding: 12,
              borderWidth: 1,
              borderRadius: 16,
              borderColor: isDark ? "#262626" : "#E0E0E0",
            }}>
            {portfolioData?.map((item, i) => {
              return (
                <Fragment key={i}>
                  <PortfolioList
                    isLast={portfolioData?.length - 1 === i}
                    item={item}
                  />
                </Fragment>
              );
            })}
          </View>

          <TouchableOpacity
            style={{
              width: "100%",
              shadowColor: "#1E90FF",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <LinearGradient
              colors={["#1E90FF", "#007BFF"]}
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 0,
              }}
              style={{
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#FFFFFF",
                }}>
                Buy Stock
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
