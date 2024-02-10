import { StyleSheet, Image, TouchableOpacity } from "react-native";

import { SafeAreaView, Text, View } from "../../components/Themed";
import useLang from "../../lib/hooks/useLang";
import { Button } from "react-native-paper";
import { Stack, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useWarmUpBrowser } from "@/lib/hooks/useWarmUpBrowser";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}
export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { getToken } = useAuth();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: "oauth_facebook",
  });
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/main");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: isBn ? "লগইন" : "Login",
        }}
      />
      <View />

      <View style={{ alignItems: "center", gap: 20 }}>
        <Image
          style={{ height: 150, width: 150, marginBottom: 24 }}
          resizeMode="contain"
          source={require("../../assets/icons/logo.png")}
        />
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Image
            style={{ height: 40, width: 40 }}
            resizeMode="contain"
            source={require("../../assets/icons/google.png")}
          />
          <Text style={{ color: "black", fontWeight: "700" }}>
            {isBn ? "গুগল দিয়ে লগইন করুন" : "Login with Google"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <FontAwesome
            style={{ paddingLeft: 20 }}
            name="apple"
            size={30}
            color="#000"
          />
          <Text style={{ color: "black", fontWeight: "700", paddingLeft: 8 }}>
            {isBn ? "অ্যাপল দিয়ে লগইন করুন" : "Login with Apple"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <FontAwesome
            style={{ paddingLeft: 20 }}
            name="facebook-square"
            size={30}
            color="#3b5998"
          />
          <Text style={{ color: "black", fontWeight: "700", paddingLeft: 8 }}>
            {isBn ? "ফেইসবুক দিয়ে লগইন করুন" : "Login with Facebook"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Link href="/contact" asChild>
          <Button mode="text" icon="phone" labelStyle={{ fontWeight: "bold" }}>
            {isBn ? "যোগাযোগ করুন" : "Contact us"}
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  btnOutline: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f3f3f3",
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
