import useChat from "@/lib/hooks/useChat";
import useLang from "@/lib/hooks/useLang";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

const DiscoverCategory = () => {
  const router = useRouter();
  const { setTemplate, setActiveConversationId } = useChat();
  const { language } = useLang();
  const isBn = language === "Bn";

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
          paddingHorizontal: 12,
        }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {isBn ? "ক্যাটাগরি" : "Category"}
        </Text>
      </View>
      <View
        style={{
          paddingVertical: 0,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          flex: 1,
          flexDirection: "row",
          gap: 13,
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}>
        <View
          style={{
            width: "47%",
            height: "100%",
            justifyContent: "space-between",
            gap: 18,
            position: "relative",
            overflow: "hidden",
          }}>
          <TouchableOpacity
            onPress={() => {
              setTemplate("general");
              setActiveConversationId(null);
              router.push({
                pathname: "/main/discover/chat",
                params: { fromPath: "list" },
              });
            }}
            style={{
              width: "100%",
              aspectRatio: 1065 / 571,
              backgroundColor: "transparent",
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
              source={require("../../assets/images/realtime.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTemplate("forex");
              setActiveConversationId(null);
              router.push({
                pathname: "/main/discover/chat",
                params: { fromPath: "list" },
              });
            }}
            style={{
              width: "100%",
              aspectRatio: 1065 / 571,
              backgroundColor: "transparent",
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
              source={require("../../assets/images/forex.png")}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/main/discover/chart/");
          }}
          style={{
            width: "48%",
            aspectRatio: 1065 / 1232.01,
            backgroundColor: "transparent",
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
            source={require("../../assets/images/stock.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DiscoverCategory;
