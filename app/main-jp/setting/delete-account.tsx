import {
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from "react-native";

import { Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { Button, TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import useUi from "@/lib/hooks/useUi";

const DeleteAccount = () => {
  const router = useRouter();
  const client = apiClient();
  const { mainServerAvailable } = useUi();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, getToken } = useAuth();
  const [inputText, setInputText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const handleDelete = async () => {
    if (inputText?.toLowerCase() === "delete my account") {
      try {
        setIsLoading(true);
        const token = await getToken();
        await client.delete(
          "/auth/account/delete",
          token,
          {},
          mainServerAvailable
        );
        await signOut();
        router.replace("/login");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to delete account");
      }
    } else {
      Alert.alert("Error", "The input text does not match");
    }
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

  // return (
  //   <View style={styles.container}>
  //     <FontAwesome name="warning" size={96} color="red" />
  //     <View style={{ paddingVertical: 12 }}>
  //       <Text>Are you sure?</Text>
  //       <Text style={{ textAlign: "center" }}>
  //         Are you sure you want to delete your account? All of your data will be
  //         delated, and this action can't be undone!
  //       </Text>
  //     </View>

  //     <Button
  //       onPress={handelDelete}
  //       buttonColor="red"
  //       textColor="white"
  //       style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
  //       labelStyle={{ fontWeight: "bold" }}
  //       contentStyle={{ paddingVertical: 4 }}
  //       mode="contained"
  //     >
  //       Delete My Account
  //     </Button>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ textAlign: "center" }}>
          Are you sure you want to delete your account? All of your data will be
          delated, and this action can't be undone!
        </Text>
      </View>
      <Button
        onPress={() => setModalVisible(true)}
        buttonColor="red"
        textColor="white"
        style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
        labelStyle={{ fontWeight: "bold" }}
        contentStyle={{ paddingVertical: 4 }}
        mode="contained"
      >
        Delete My Account and Data
      </Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(256,256,256,0.5)"
                : "rgba(0,0,0,0.5)",
          }}
        >
          <View style={styles.modalView}>
            <Text>Delete account</Text>
            <Text>Please enter "Delete My Account"</Text>
            <TextInput
              mode="outlined"
              style={{ width: "100%", marginTop: 20 }}
              onChangeText={setInputText}
              value={inputText}
              placeholder="Type here"
            />
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleDelete}
                buttonColor="red"
                textColor="white"
                style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ paddingVertical: 4 }}
                mode="contained"
              >
                Confirm
              </Button>
              <Button
                onPress={() => setModalVisible(false)}
                buttonColor="grey"
                textColor="white"
                style={{ borderRadius: 4, marginTop: 12, width: "100%" }}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ paddingVertical: 4 }}
                mode="contained"
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(256,256,256,0.5)",
  },
  modalView: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 4,
    width: "100%",
    backgroundColor: "transparent",
  },
});

export default DeleteAccount;
