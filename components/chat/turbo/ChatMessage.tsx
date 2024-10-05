import Colors from "@/constants/Colors";

import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";

const ChatMessage = ({ content, role, imageUrl, prompt, loading }: any) => {
  return (
    <View style={styles.row}>
      <Image
        source={{ uri: "https://galaxies.dev/img/meerkat_2.jpg" }}
        style={styles.avatar}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <Text style={styles.text}>{content}</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  loading: {
    justifyContent: "center",
    height: 26,
    marginLeft: 14,
  },
});
export default ChatMessage;
