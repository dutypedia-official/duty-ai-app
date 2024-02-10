import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, useThemeColor } from "../../components/Themed";
import { useEffect, useState } from "react";
import { Card, IconButton, Text } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";
import { apiClient } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function TabTwoScreen() {
  const { getToken } = useAuth();
  const { setActiveConversationId } = useChat();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const color = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "cardBg");
  const client = apiClient();
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get("/messages/conv/get-all", token);
      setHistories(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handelDelete = (id: string) => {
    Alert.alert(
      "Delete history",
      "Are you sure you want to delete this history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await getToken();
              setHistories((previousHistories: any) =>
                previousHistories?.filter((history: any) => history.id !== id)
              );

              await client.delete(`/messages/conv/delete/${id}`, token);
              fetchData();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></View>
    );
  }

  if (histories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <MaterialIcons
            style={{ opacity: 0.5 }}
            name="history-toggle-off"
            size={100}
            color={color}
          />
          <Text
            variant="titleLarge"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            No history yet
          </Text>
          <Text style={{ textAlign: "center", opacity: 0.5, marginTop: 8 }}>
            Start chat with the AI to create your history
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <FlatList
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        data={histories}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            onPress={() => {
              setActiveConversationId(item.id);
              router.push("/main");
            }}
            key={index}
          >
            <Card mode="contained" style={{ backgroundColor: bgColor }}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
                    <View>
                      <Text numberOfLines={1} variant="titleMedium">
                        {item.name}
                      </Text>
                      <Text
                        style={{ opacity: 0.5 }}
                        numberOfLines={1}
                        variant="bodyMedium"
                      >
                        {item.createdAt}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexShrink: 0, width: 40 }}>
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      onPress={() => handelDelete(item.id)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
