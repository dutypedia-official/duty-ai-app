import { View } from "../../components/Themed";
import { Avatar } from "react-native-paper";
import { Text } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import Hyperlink from "react-native-hyperlink";

const CommentCard = ({ item }: any) => {
  const { user } = useUser();
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
            alignItems: "flex-start",
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
              {item.userInfo?.name || "Duty"}
            </Text>
            <View style={{ position: "relative", overflow: "hidden" }}>
              <Hyperlink linkStyle={{ color: "#0C9462" }} linkDefault={true}>
                <Text
                  selectable={true}
                  selectionColor="teal"
                  variant="titleMedium"
                >
                  {item.text}
                </Text>
              </Hyperlink>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
