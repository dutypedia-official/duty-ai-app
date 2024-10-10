import { apiClient } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import Entypo from "@expo/vector-icons/Entypo";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View, useThemeColor } from "../Themed";

const DiscoverHistory = () => {
  const { language } = useLang();
  const isBn = language === "Bn";
  const router = useRouter();
  const { getToken } = useAuth();
  const { refreash } = useUi();
  const { setActiveConversationId, histories, setHistories } = useChat();
  const le5e5e5 = useThemeColor({}, "le5e5e5");
  const MaxLimit = 50;
  const client = apiClient();
  const isDark = useColorScheme() === "dark";
  const bgColor = useThemeColor({}, "background");

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get("/messages/conv/get-all", token);
      setHistories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ backgroundColor: bgColor }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
          paddingHorizontal: 12,
          backgroundColor: "transparent",
        }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {isBn ? "চ্যাট হিস্টরি" : "Chat history"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/main/discover/history")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
          }}>
          <Text style={{ color: isDark ? "#34D399" : "#000000" }}>
            {isBn ? "সব দেখুন" : "See all"}
          </Text>
          <Entypo
            name="chevron-right"
            size={24}
            color={isDark ? "#34D399" : "#000000"}
          />
        </TouchableOpacity>
      </View>

      {histories?.length == 0 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            backgroundColor: isDark ? "#151615" : "#E5E5E5",
            paddingVertical: 12,
            marginHorizontal: 12,
          }}>
          <Text style={{ color: "#777373" }}>
            {isBn ? "এখন পর্যন্ত কোনও চ্যাট করা হয়নাই" : "No chat yet"}
          </Text>
        </View>
      )}
      {histories?.length > 0 && (
        <View style={{ backgroundColor: "transparent" }}>
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
              backgroundColor: "transparent",
            }}>
            {histories.slice(0, 10).map((item: any, index: number) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveConversationId(item.id);
                  router.push("/main");
                }}
                key={index}
                style={{
                  borderRadius: 100,
                  backgroundColor: le5e5e5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    marginHorizontal: 20,
                    marginVertical: 8,
                  }}
                  numberOfLines={1}>
                  {item.name?.length > MaxLimit
                    ? item.name.substring(0, MaxLimit - 3) + "..."
                    : item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DiscoverHistory;
