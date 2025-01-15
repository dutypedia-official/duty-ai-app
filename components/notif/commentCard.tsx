import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";

export default function NotiCommentCard({
  logoUrl,
  comment,
}: {
  logoUrl: any;
  comment: any;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [viewMoreComment, setViewMoreComment] = useState(false);
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8,
          }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
              position: "relative",
            }}>
            <View
              style={{
                width: 36,
                height: 36,
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
                A
              </Text>
            </View>

            {logoUrl && (
              <Image source={{ uri: logoUrl }} width={36} height={36} />
            )}
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
              numberOfLines={1}>
              Salma Akater abcdefg...
            </Text>

            <Text
              numberOfLines={3}
              style={{
                flexShrink: 1,
                color: isDark ? "#D3D3D3" : "#004662",
                fontSize: 12,
                fontWeight: "normal",
              }}>
              01/01/2025 1 minute ago
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-start",
          flex: 1,
          marginTop: 5,
        }}>
        <View
          style={{
            width: 36,
          }}></View>

        <Pressable
          onPress={() => {
            setViewMoreComment(!viewMoreComment);
          }}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
          <Text
            // numberOfLines={3}
            style={{
              fontSize: 14,
              alignItems: "center",
              justifyContent: "center",
              color: isDark ? "#EAEAEA" : "#333333",
            }}>
            {viewMoreComment ? comment : comment?.substring(0, 186)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setViewMoreComment(!viewMoreComment);
            }}
            style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                color: isDark ? "#00FFFF" : "#0078FF",
              }}>
              {viewMoreComment ? "...See less" : "See more..."}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    </View>
  );
}
