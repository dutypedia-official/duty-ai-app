import ConfettiCannon from "react-native-confetti-cannon";
import { Stack, Link, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, useThemeColor } from "@/components/Themed";
import useLang from "@/lib/hooks/useLang";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Text } from "react-native-paper";

const ContactSuccessScreen = () => {
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const isBn = language === "Bn";
  const primaryColor = useThemeColor({}, "primary");
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Success",
        }}
      />
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        fallSpeed={2500}
        fadeOut={true}
        autoStart={true}
      />
      <View />
      <View style={{ alignItems: "center", gap: 12 }}>
        <FontAwesome name="check-circle" size={96} color={primaryColor} />
        <Text style={{ fontSize: 24, fontWeight: "bold", color: primaryColor }}>
          {isBn ? "আপনার অনুরোধ জমা হয়েছে!" : "Your request is submitted !"}
        </Text>
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          {isBn
            ? "আমাদের সাথে যোগাযোগ করার জন্য আপনাকে ধন্যবাদ। আমাদের টিম আপনার বার্তা রিভিউ করছে এবং যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করবে।"
            : "Thank you for contacting us. Our team is reviewing your message and will be in touch with you as soon as possible."}
        </Text>
      </View>
      <Button
        onPress={() => {
          router.back();
        }}
        icon="arrow-left"
        style={{ borderRadius: 4, marginTop: 12 }}
        labelStyle={{ fontWeight: "bold" }}
        contentStyle={{ paddingVertical: 4 }}
        mode="contained"
      >
        {isBn ? "ফিরে যান" : "Back"}
      </Button>
    </SafeAreaView>
  );
};

export default ContactSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    resizeMode: "contain",
    position: "relative",
  },
});
