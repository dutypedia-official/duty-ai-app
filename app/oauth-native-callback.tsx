import { View } from "@/components/Themed";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const OAuthCallback = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "OAuth",
        }}
      />
      <ActivityIndicator size="large" />
    </View>
  );
};

export default OAuthCallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
