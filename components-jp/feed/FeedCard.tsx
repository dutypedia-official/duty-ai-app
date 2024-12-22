import { View } from "../../components/Themed";
import { Avatar } from "react-native-paper";
import { Text } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { TouchableOpacity, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import Constants from "expo-constants";
import Hyperlink from "react-native-hyperlink";
import { AntDesign } from "@expo/vector-icons";
import { apiClient } from "@/lib/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FeedCard = ({ item, isFeed = true }: any) => {
  const { user } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const client = apiClient();
  const [isLoading, setIsLoading] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [commentsCount, setCommentsCount] = useState(item.commentsCount || 0);
  const [likes, setLikes] = useState(
    (item?.reacts?.filter((react: any) => react.type === "Like")?.length || 0) +
      item.fLikes
  );
  const [dislikes, setDislikes] = useState(
    item?.reacts?.filter((react: any) => react.type === "Dislike")?.length || 0
  );
  const [likedByMe, setLikedByMe] = useState(
    item?.reacts?.some(
      (react: any) => react.type === "Like" && react.userId === user?.id
    )
  );
  const [dislikedByMe, setDislikedByMe] = useState(
    item?.reacts?.some(
      (react: any) => react.type === "Dislike" && react.userId === user?.id
    )
  );
  const [views, setViews] = useState((item.viewCount || 0) + item.fViews);

  const colorScheme = useColorScheme();

  const giveReact = async (type: "Like" | "Dislike") => {
    if (isLoading || !user) return;

    try {
      setIsLoading(true);
      if (type == "Like") {
        if (likedByMe) {
          if (likes > 0) {
            setLikes(likes - 1);
          }
          setLikedByMe(false);
        } else {
          setLikes(likes + 1);
          setLikedByMe(true);
          if (dislikedByMe) {
            if (dislikes > 0) {
              setDislikes(dislikes - 1);
            }
            setDislikedByMe(false);
          }
        }
      } else {
        if (dislikedByMe) {
          setDislikes(dislikes - 1);
          setDislikedByMe(false);
        } else {
          setDislikes(dislikes + 1);
          setDislikedByMe(true);
          if (likedByMe) {
            setLikes(likes - 1);
            setLikedByMe(false);
          }
        }
      }
      const token = await getToken();
      const { data } = await client.post(
        `/messages/react/${item.id}`,
        {
          reactType: type,
        },
        token
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const incViews = async () => {
    try {
      setReadMore(!readMore);

      const token = await getToken();
      const { data } = await client.post(
        `/messages/view/${item.id}`,
        {},
        token
      );
      if (data.success) setViews(views + 1);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Avatar.Image
            size={48}
            source={{ uri: item.userInfo?.profilePhoto }}
          />
          <View>
            <Text
              style={{ fontWeight: "700" }}
              numberOfLines={1}
              variant="titleMedium"
            >
              {item.userInfo?.name}
            </Text>
            <Text numberOfLines={1}>
              {new Date(item.createdAt).toLocaleDateString()}{" "}
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        {/* <AntDesign name="edit" size={24} color={textColor} /> */}
      </View>
      <View style={{ paddingTop: 8, position: "relative", overflow: "hidden" }}>
        <Text
          style={{
            fontWeight: "700",
          }}
          numberOfLines={1}
          variant="titleMedium"
        >
          {item.message?.template}
        </Text>
        <Text variant="titleMedium" style={{ paddingVertical: 8 }}>
          {item.question}
        </Text>
        <Hyperlink linkStyle={{ color: "#0C9462" }} linkDefault={true}>
          <Text
            selectable={true}
            selectionColor="teal"
            variant="titleMedium"
            numberOfLines={readMore ? 0 : 8}
          >
            {item.message.text}
          </Text>
        </Hyperlink>
        {!readMore && (
          <LinearGradient
            // Background Linear Gradient
            colors={
              colorScheme == "dark"
                ? ["transparent", "rgba(0,0,0,1)"]
                : ["transparent", "rgba(255,255,255,1)"]
            }
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "70%",
            }}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={incViews}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 8,
        }}
      >
        <Text style={{ fontWeight: "700" }}>
          {readMore ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <TouchableOpacity onPress={() => giveReact("Like")}>
            <Text>
              <AntDesign
                style={{
                  ...(likedByMe && { color: "#0C9462" }),
                }}
                name="like2"
                size={20}
              />{" "}
              {likes || "0"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingTop: 3 }}
            onPress={() => {
              if (isFeed) {
                router.push({
                  pathname: "/main/feed/view",
                  params: { post: JSON.stringify(item) },
                });
              }
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, alignItems: "center" }}
            >
              <Text>
                <MaterialCommunityIcons name="comment-text-outline" size={20} />{" "}
              </Text>
              <Text>{commentsCount || "0"}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text>Views {views || "0"}</Text>
        </View>
      </View>
    </View>
  );
};

export default FeedCard;
