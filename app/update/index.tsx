import useLang from "@/lib/hooks/useLang";
import React from "react";
import { View, Text, Dimensions, Linking, Platform } from "react-native";
import { Button } from "react-native-paper";
import { SvgXml } from "react-native-svg";

export default function UpdatePage() {
  const { updateInfo, language } = useLang();
  const isBn = language === "Bn";

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <SvgXml xml={icon} />
      <Text
        style={{
          marginTop: 12,
          fontWeight: "500",
          fontSize: 20,
          color: "black",
        }}
      >
        {isBn ? "নতুন আপডেট এসেছে" : "Update Available"}
      </Text>
      <Text
        style={{
          marginTop: 12,
          fontWeight: "400",
          fontSize: 13,
          color: "white",
        }}
      >
        {isBn ? "ভার্সন" : "Version"} {updateInfo?.current_version}
      </Text>
      <View
        style={{
          position: "absolute",
          bottom: 20,
        }}
      >
        <Button
          onPress={() => {
            Linking.openURL(
              Platform.OS == "android"
                ? "https://play.google.com/store/apps/details?id=com.easinarafat.dutyai"
                : "https://apps.apple.com/us/app/duty-ai/id6476618432"
            );
          }}
          style={{
            width: Dimensions.get("window").width - 40,
          }}
        >
          {isBn ? "আপডেট করুন" : "UPDATE NOW"}
        </Button>
      </View>
    </View>
  );
}
const icon = `<svg width="61" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2242_20356)">
<path d="M30.5 5C44.3075 5 55.5 16.1925 55.5 30C55.5 43.8075 44.3075 55 30.5 55C16.6925 55 5.5 43.8075 5.5 30C5.5 16.1925 16.6925 5 30.5 5ZM30.5 10C25.1957 10 20.1086 12.1071 16.3579 15.8579C12.6071 19.6086 10.5 24.6957 10.5 30C10.5 35.3043 12.6071 40.3914 16.3579 44.1421C20.1086 47.8929 25.1957 50 30.5 50C35.8043 50 40.8914 47.8929 44.6421 44.1421C48.3929 40.3914 50.5 35.3043 50.5 30C50.5 24.6957 48.3929 19.6086 44.6421 15.8579C40.8914 12.1071 35.8043 10 30.5 10ZM30.5 37.5C31.163 37.5 31.7989 37.7634 32.2678 38.2322C32.7366 38.7011 33 39.337 33 40C33 40.663 32.7366 41.2989 32.2678 41.7678C31.7989 42.2366 31.163 42.5 30.5 42.5C29.837 42.5 29.2011 42.2366 28.7322 41.7678C28.2634 41.2989 28 40.663 28 40C28 39.337 28.2634 38.7011 28.7322 38.2322C29.2011 37.7634 29.837 37.5 30.5 37.5ZM30.5 15C31.163 15 31.7989 15.2634 32.2678 15.7322C32.7366 16.2011 33 16.837 33 17.5V32.5C33 33.163 32.7366 33.7989 32.2678 34.2678C31.7989 34.7366 31.163 35 30.5 35C29.837 35 29.2011 34.7366 28.7322 34.2678C28.2634 33.7989 28 33.163 28 32.5V17.5C28 16.837 28.2634 16.2011 28.7322 15.7322C29.2011 15.2634 29.837 15 30.5 15Z" fill="#2B32B2"/>
</g>
<defs>
<clipPath id="clip0_2242_20356">
<rect width="60" height="60" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`;
