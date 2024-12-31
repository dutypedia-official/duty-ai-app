import { Text, View, useThemeColor } from "@/components/Themed";
import CommentCard from "@/components/feed/CommentCard";
import FeedCard from "@/components/feed/FeedCard";
import { apiClient } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";

const FeedView = () => {
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setIsLoading] = useState(true);
  const [refreash, setRefreash] = useState(false);
  const data = useLocalSearchParams();
  const post = JSON.parse(data.post.toString());
  const [text, setText] = useState("");
  const inputBgColor = useThemeColor({}, "chatInputBg");
  const client = apiClient();
  const { mainServerAvailable } = useUi();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [comments, setComments] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchData = async (init: boolean = true) => {
    try {
      if (init) {
        setIsLoading(true);
        setPage(1);
      }
      const { data } = await client.get(
        `/messages/comments/${post?.id}/${page}`,
        null,
        {},
        mainServerAvailable
      );
      if (data.length < limit) {
        setHasMore(false);
      }
      if (init) {
        setComments(data);
      } else {
        setComments([...comments, ...data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handelSubmit = async () => {
    if (!text || !user) return;
    try {
      setLoading(true);
      const token = await getToken();

      await client.post(
        "/messages/comment/new",
        {
          feedMessageId: post.id,
          text,
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0].emailAddress,
          profilePhoto: user.imageUrl,
        },
        token
      );
      setText("");
      setRefreash(!refreash);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreash]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.container}>
          <FlashList
            ListHeaderComponent={() => (
              <View>
                <FeedCard isFeed={false} item={post} />
                <View
                  style={styles.separator}
                  lightColor="#eee"
                  darkColor="rgba(255,255,255,0.1)"
                />
              </View>
            )}
            onEndReachedThreshold={0}
            ItemSeparatorComponent={() => (
              <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
              />
            )}
            data={comments}
            contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
            renderItem={({ item, index }: any) => (
              <CommentCard item={item} key={index} />
            )}
          />
        </View>
        <View style={{}}>
          <TextInput
            value={text}
            disabled={isLoading}
            placeholder="Write a comment..."
            multiline={true}
            //   left={<TextInput.Icon icon="text" />}
            outlineStyle={{
              borderRadius: 0,
            }}
            contentStyle={{
              backgroundColor: inputBgColor,
            }}
            onChangeText={(text) => setText(text)}
          />
          {isLoading ? (
            <ActivityIndicator
              style={{
                position: "absolute",
                right: 0,
                paddingRight: 20,
                bottom: "50%",
                zIndex: 1,
                transform: [{ translateY: 12 }],
              }}
            />
          ) : (
            <TouchableOpacity
              disabled={isLoading}
              onPress={handelSubmit}
              style={{
                position: "absolute",
                right: 0,
                paddingRight: 20,
                bottom: "50%",
                zIndex: 1,
                transform: [{ translateY: 12 }],
              }}>
              <Text>
                <Ionicons name="send" size={24} />
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    height: 120,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: "100%",
  },
});
export default FeedView;
