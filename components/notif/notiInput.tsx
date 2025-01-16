import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, { Fragment, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function NotiInput() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Fragment>
      <View
        style={{
          gap: 4,
        }}>
        <View
          style={{
            borderWidth: 1,
            backgroundColor: isDark ? "#1F1F1F" : "#FFFFFF",
            borderRadius: 8,
            borderColor: isDark ? "#444950" : "#D1D1D1",
          }}>
          <TextInput
            multiline
            maxLength={1000}
            value={commentText}
            onChangeText={setCommentText}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              textAlignVertical: "top",
              textAlign: "left",
              color: isDark ? "#fff" : "#888888",
              minHeight: 80,
              maxHeight: 100,
              fontSize: 16,
            }}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#888"
            returnKeyType="send"
          />
        </View>

        {commentText.length === 1000 && (
          <Text style={{ color: "red", fontSize: 14 }}>
            Within 1000 characters
          </Text>
        )}
      </View>

      <View
        style={{
          backgroundColor: "transparent",
        }}>
        <TouchableOpacity
          disabled={loading || commentText.length === 0 ? true : false}
          onPress={() => {
            // setLoading(true);
          }}
          style={{}}>
          <LinearGradient
            colors={["#00A8FF", "#0078FF"]}
            style={{
              padding: 12,
              borderRadius: 12,
              opacity: commentText.length > 0 ? 1 : 0.2,
            }}>
            {loading && (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={{ marginRight: 5 }}
              />
            )}
            {!loading && (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: 16,
                  textAlign: "center",
                  height: 19,
                }}>
                Post
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}
