import { View, useThemeColor } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "react-native-paper";
import { SvgUri } from "react-native-svg";
import { formatDate } from "date-fns/format";

const Noti = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notifications, setNotifications] = useState<any>([]);
  const { getToken } = useAuth();
  const isFocused = useIsFocused();
  const { refreash, setRefreash, mainServerAvailable } = useUi();

  const [loading, setLoading] = useState<boolean>(true);
  const borderColor = isDark ? "#191919" : "#EAEDED";
  const client = apiClient();

  const { language } = useLang();
  const isBn = language === "Bn";

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/noti/get-all/1",
        token,
        {},
        mainServerAvailable
      );
      console.log(data);
      setRefreash(!refreash);
      setNotifications(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  if (notifications.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#0F0F0F" : "#F0F2F5",
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: isDark ? "#0F0F0F" : "#F0F2F5",
          }}>
          <Text>
            <MaterialCommunityIcons color="#2a52b9" name="bell" size={24} />
          </Text>
          <Text
            style={{
              color: "#2a52b9",
              fontSize: 20,
              fontWeight: "600",
            }}>
            {isBn ? "নোটিফিকেশান নেই" : "No notifications"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={notifications}
        renderItem={({ item }: any) => <NotiItem item={item} />}
      />
    </View>
  );
};

const NotiItem = ({ item }: any) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const logoUrl =
    item?.logo ||
    `https://s3-api.bayah.app/cdn/symbol/logo/${item.companyName}.svg`;
  const borderColor = useThemeColor({}, "border");
  const isRead = item?.isRead;

  return (
    <TouchableOpacity
      activeOpacity={item.type == "analysis" ? 0.7 : 1}
      onPress={() => {
        if (item.type == "analysis") {
          router.push(`/main/notification/details/${item.entityId}`);
        }
      }}>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 8,
          backgroundColor: isRead
            ? "transparent"
            : isDark
            ? "#24303C"
            : "#CEE6FF",
        }}>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8,
          }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
              position: "relative",
              marginTop: 6,
            }}>
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: "#FFFFFF",
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
                {item?.companyName[0]}
              </Text>
            </View>
            {logoUrl && <SvgUri uri={logoUrl} width={24} height={24} />}
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              flexShrink: 1,
              justifyContent: "space-between",
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: isDark ? "#87CEEB" : "#000000",
              }}
              numberOfLines={1}
              variant="titleMedium">
              {item.companyName}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                flexShrink: 1,
                color: isDark ? "#D3D3D3" : "#004662",
                fontSize: 12,
                fontWeight: "normal",
              }}>
              {item.message}
            </Text>
            <View
              style={{
                backgroundColor: "transparent",
                paddingTop: 8,
                flexDirection: "row",
                justifyContent: "flex-end",
                flexShrink: 1,
              }}>
              <Text
                style={{
                  color: "#5C5C5C",
                  fontSize: 10,
                  fontWeight: "normal",
                }}>
                {formatDate(item.createdAt, "dd/MM/yyy p")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Noti;
