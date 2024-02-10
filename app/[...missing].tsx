import { Stack, useRouter } from "expo-router";
import { StyleSheet, Image } from "react-native";

import { Text, View } from "../components/Themed";
import { Button } from "react-native-paper";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Image
          style={{ height: 200, width: 200 }}
          resizeMode="contain"
          source={require("@/assets/images/404.png")}
        />
        <Text style={styles.title}>
          The screen you visited is not on earth!
        </Text>

        <Button
          onPress={() => {
            router.back();
          }}
          icon="logout"
          style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
          labelStyle={{ fontWeight: "bold" }}
          contentStyle={{ paddingVertical: 4 }}
          mode="outlined"
        >
          Go Back
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
