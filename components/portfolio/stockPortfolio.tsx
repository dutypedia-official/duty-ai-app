import { LinearGradient } from "expo-linear-gradient";
import React, { Fragment } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import PortfolioList from "./portfolioList";
import { router } from "expo-router";
import { SvgXml } from "react-native-svg";
import {
  notfoundPortfolio,
  notfoundPortfolioLight,
} from "../svgs/notfound-portfolio";
import useLang from "@/lib/hooks/useLang";

export default function StockPortfolio({
  withdrawBalance,
}: {
  withdrawBalance: string;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { language } = useLang();
  const isBn = language === "bn";

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
            {isBn ? "স্টক পোর্টফোলিও" : "Stock Portfolio"}
          </Text>
        </View>
        <View
          style={{
            gap: 24,
          }}>
          {portfolioData?.length === 0 ? (
            <View
              style={{
                backgroundColor: isDark ? "#1A1A1A" : "#F8F9FA",
                paddingHorizontal: 12,
                paddingVertical: 24,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: isDark ? "#262626" : "#E0E0E0",
                gap: 26,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <SvgXml
                width={"100%"}
                xml={isDark ? notfoundPortfolio : notfoundPortfolioLight}
              />
              <View
                style={{
                  width: 240,
                  paddingHorizontal: 6,
                }}>
                <Text
                  style={{
                    color: isDark ? "#FFFFFF" : "#34343F",
                    fontSize: 18,
                    fontWeight: "medium",
                    textAlign: "center",
                  }}>
                  {isBn ? "কোনো স্টক পাওয়া যায়নি।" : "No stock found"}
                </Text>
              </View>
              <View
                style={{
                  width: 240,
                  paddingHorizontal: 6,
                }}>
                <Text
                  style={{
                    color: isDark ? "#B0B0B0" : "#464665",
                    textAlign: "center",
                    fontSize: 14,
                  }}>
                  {isBn
                    ? "আপনি এখনো কোনো স্টক লেনদেন করেননি, নিচের বোতামে ক্লিক করে একটি স্টক কিনুন এবং আপনার যাত্রা শুরু করুন।"
                    : "You haven't made any stock transactions yet. Click the button below to buy a stock and start your journey."}
                </Text>
              </View>
            </View>
          ) : (
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
          )}

          <TouchableOpacity
            onPress={() => {
              router.push("/main/setting/buy-stock");
            }}
            style={{
              width: "100%",
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <LinearGradient
              colors={
                withdrawBalance === "0"
                  ? isDark
                    ? ["#3C3C47", "#3C3C47"]
                    : ["#E0E0E0", "#E0E0E0"]
                  : ["#1E90FF", "#007BFF"]
              }
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
                  color:
                    withdrawBalance === "0"
                      ? isDark
                        ? "#A0A0A0"
                        : "#666666"
                      : "#FFFFFF",
                  fontWeight: "bold",
                }}>
                {isBn ? "স্টক কিনুন" : "Buy Stock"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
