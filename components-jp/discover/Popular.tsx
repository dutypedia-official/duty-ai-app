import { Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { Text, View, useThemeColor } from "../Themed";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import useChat from "@/lib/hooks/useChat";
import { useState } from "react";
import { apiClient } from "@/lib/api";
import { ActivityIndicator, Button } from "react-native-paper";
import useLang from "@/lib/hooks/useLang";

const prompts = [
  {
    id: 1,
    title: "Central Pharma",
    template: "finance",
  },
  {
    id: 2,
    title: "Navana pharma",
    template: "finance",
  },
  {
    id: 3,
    title: "Deshbandhu",
    template: "financel",
  },
  {
    id: 4,
    title: "Today top news",
    template: "general",
  },
  {
    id: 5,
    title: "Eurusd",
    template: "forex",
  },
  {
    id: 6,
    title: "xauusd",
    template: "forex",
  },
  {
    id: 7,
    title: "Grameenphone",
    template: "Finance",
  },
  {
    id: 8,
    title: "Linde Bangladesh",
    template: "finance",
  },
  {
    id: 9,
    title: "SQURPHARMA",
    template: "finance",
  },
  {
    id: 10,
    title: "Beximco Pharma",
    template: "finance",
  },
  {
    id: 11,
    title: "AGNISYSL",
    template: "finance",
  },
  {
    id: 12,
    title: "Today top sports news",
    template: "general",
  },
  {
    id: 13,
    title: "Bangladesh current situation",
    template: "general",
  },
  {
    id: 14,
    title: "gbpusd",
    template: "forex",
  },
  {
    id: 15,
    title: "Earn money online perday 100$",
    template: "general",
  },
  {
    id: 16,
    title: "Baby cute name for muslim",
    template: "general",
  },
  {
    id: 17,
    title: "AAMRANET",
    template: "finance",
  },
  {
    id: 18,
    title: "Khulna power",
    template: "finance",
  },
  {
    id: 19,
    title: "bangladesh beautyfull place for travel",
    template: "general",
  },
  {
    id: 20,
    title: "How to get american visa as a student",
    template: "general",
  },
];

const PopularPrompts = () => {
  const { language } = useLang();
  const isBn = language === "bn";
  const router = useRouter();
  const { setTemplate, setActiveConversationId, setPrompt, setSubmitPrompt } =
    useChat();
  const l545454 = useThemeColor({}, "l545454");
  const MaxLimit = 30;
  return (
    <View style={{ paddingLeft: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}>
        <Text style={{ fontSize: 20 }}>
          {isBn ? "জনপ্রিয় নির্দেশ" : "Popular prompts"}
        </Text>
      </View>
      <View style={{ paddingBottom: 20 }}>
        <ScrollView
          style={{
            flexGrow: 0,
            flexShrink: 0,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-start",
            alignSelf: "flex-start",
            gap: 12,
          }}>
          {prompts.slice(0, 10).map((item: any, index) => (
            <TouchableOpacity
              onPress={() => {
                setTemplate(item.template);
                setActiveConversationId(null);
                setPrompt(item.title);
                router.push("/main-jp/home");
              }}
              key={index}
              style={{
                borderRadius: 100,
                borderWidth: 1,
                backgroundColor: l545454,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  marginHorizontal: 20,
                  marginVertical: 8,
                  color: "white",
                }}>
                {item.title?.length > MaxLimit
                  ? item.title.substring(0, MaxLimit - 3) + "..."
                  : item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingBottom: 20 }}>
        <ScrollView
          style={{
            flexGrow: 0,
            flexShrink: 0,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-start",
            alignSelf: "flex-start",
            gap: 12,
          }}>
          {prompts.slice(10, 20).map((item: any, index) => (
            <TouchableOpacity
              onPress={() => {
                setTemplate(item.template);
                setActiveConversationId(null);
                setPrompt(item.title);
                router.push("/main-jp/home");
              }}
              key={index}
              style={{
                borderRadius: 100,
                borderWidth: 1,
                backgroundColor: l545454,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  marginHorizontal: 20,
                  marginVertical: 8,
                  color: "white",
                }}>
                {item.title?.length > MaxLimit
                  ? item.title.substring(0, MaxLimit - 3) + "..."
                  : item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default PopularPrompts;
