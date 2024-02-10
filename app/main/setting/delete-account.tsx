import { StyleSheet, Image, ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";

const DeleteAccount = () => {
  const router = useRouter();
  const client = apiClient();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, getToken } = useAuth();

  const handelDelete = () => {
    Alert.prompt(
      "Delete account",
      'Please enter "Delete My Account"',
      [
        {
          text: "Cancel",
          onPress: () => router.back(),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (text) => {
            if (text?.toLowerCase() == "delete my account") {
              try {
                setIsLoading(true);
                const token = await getToken();
                await client.delete("/auth/account/delete", token);
                await signOut();
                router.replace("/login");
              } catch (error) {
                console.log(error);
                setIsLoading(false);
              }
            }
          },
        },
      ],
      "plain-text"
    );
  };

  if (isLoading) {
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
  }

  return (
    <>
      <View style={styles.container}>
        <FontAwesome name="warning" size={96} color="red" />
        <View style={{ paddingVertical: 12 }}>
          <Text style={styles.title}>Are you sure?</Text>
          <Text style={{ textAlign: "center" }}>
            Are you sure you want to delete your account? All of your data will
            be delated, and this action can't be undone!
          </Text>
        </View>

        <Button
          onPress={handelDelete}
          buttonColor="red"
          textColor="white"
          style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
          labelStyle={{ fontWeight: "bold" }}
          contentStyle={{ paddingVertical: 4 }}
          mode="contained"
        >
          Delete My Account
        </Button>
      </View>
    </>
  );
};

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

export default DeleteAccount;
