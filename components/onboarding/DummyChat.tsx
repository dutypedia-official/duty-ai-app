import { FunctionComponent } from "react";
import { Text, View } from "react-native";

interface DummyChatProps {
  title: string;
  subTitle: string;
  direction: "left" | "right";
}

const DummyChat: FunctionComponent<DummyChatProps> = ({
  title,
  subTitle,
  direction = "left",
}) => {
  return (
    <View
      style={{ alignSelf: direction == "left" ? "flex-start" : "flex-end" }}
    >
      <View
        style={{
          paddingHorizontal: 32,
          paddingVertical: 4,
          backgroundColor: "#02AAB0",
          alignSelf: direction == "left" ? "flex-start" : "flex-end",
          borderRadius: 8,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 32,
          paddingVertical: 12,
          backgroundColor: "#444654",
          alignSelf: "flex-start",
          borderRadius: 8,
          marginTop: -8,
          marginLeft: direction == "left" ? 12 : 0,
          marginRight: direction == "left" ? 0 : 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontWeight: "bold",
            color: "white",
          }}
        >
          {subTitle}
        </Text>
      </View>
    </View>
  );
};

export default DummyChat;
