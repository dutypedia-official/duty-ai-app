import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import useMarket from "@/lib/hooks/useMarket";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "./Themed";
import { Ionicons } from "@expo/vector-icons";

const TermsAndConditions = ({ market }: { market?: any }) => {
  const insets = useSafeAreaInsets();
  const bgColor = useThemeColor({}, "background");
  const { setSelectMarket } = useMarket();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to create a delay using a Promise
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handlePress = async (event: GestureResponderEvent): Promise<void> => {
    setIsLoading(true); // Start loading
    await delay(3000); // Wait for 3 seconds
    setSelectMarket(market); // Set the market after loading
    setIsLoading(false); // Stop loading
    router.replace("/main/home"); // Perform the navigation
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop: insets.top,
        },
      ]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        style={{
          paddingTop: insets.top,
          position: "absolute",
          backgroundColor: "transparent",
          marginLeft: 20,
          paddingVertical: 10,
          zIndex: 9999,
          right: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}>
          <LinearGradient
            colors={["#6A4E9D", "#8E44AD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
              width: 36,
              height: 36,
              opacity: 0.9,
            }}>
            <Text>
              <Ionicons name="close" size={24} style={{ color: "#FFFFFF" }} />
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}>
        <LinearGradient
          colors={["#4A148C", "#2A2B2A"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
      </View>
      <View style={styles.background}>
        <ScrollView contentContainerStyle={[styles.contentContainer]}>
          <Text style={styles.heading}>Terms and Conditions for Duty AI</Text>

          <Text style={styles.subheading}>1. User Agreement</Text>
          <Text style={styles.paragraph}>
            By accessing or using Duty AI, you acknowledge and agree to these
            terms, which govern the app's use and its features.
          </Text>

          <Text style={styles.subheading}>2. Educational Purpose</Text>
          <Text style={styles.paragraph}>
            Duty AI is designed as an educational tool to provide insights and
            analyses related to the stock market. All features, signals, and
            notifications within the app are intended solely for informational
            and educational purposes.
          </Text>

          <Text style={styles.subheading}>3. No Financial Liability</Text>
          <Text style={styles.paragraph}>
            The analyses, predictions, and signals provided through Duty AI are
            generated for educational purposes only. Users are advised to
            exercise their own judgment and discretion when making financial
            decisions. Duty AI and its developers do not bear responsibility for
            any financial outcomes, including profits or losses, resulting from
            the use of the app.
          </Text>

          <Text style={styles.subheading}>4. Account Responsibility</Text>
          <Text style={styles.paragraph}>
            Users may need to create accounts for personalized experiences.
            Maintaining the confidentiality of account details is the user's
            responsibility.
          </Text>

          <Text style={styles.subheading}>5. Data Usage</Text>
          <Text style={styles.paragraph}>
            Duty AI collects minimal user data necessary for providing a
            seamless and personalized experience. Measures are in place to
            secure and protect this data. By using the app, you consent to this
            data collection as outlined in our privacy policy.
          </Text>

          <Text style={styles.subheading}>6. User-Generated Content</Text>
          <Text style={styles.paragraph}>
            Users are solely responsible for any content they generate or share
            within the platform. Duty AI reserves the right to moderate or
            remove any content deemed inappropriate or in violation of these
            terms.
          </Text>

          <Text style={styles.subheading}>7. Notifications and Alerts</Text>
          <Text style={styles.paragraph}>
            Notifications and trade analyses provided by Duty AI are part of its
            educational features. These should not be considered as financial
            advice or a recommendation to buy or sell stocks. Duty AI does not
            guarantee the accuracy, completeness, or reliability of any such
            notifications or analyses.
          </Text>

          <Text style={styles.subheading}>8. Risk Disclaimer</Text>
          <Text style={styles.paragraph}>
            The stock market is inherently volatile and carries significant
            risks. Users are strongly encouraged to seek professional financial
            advice before making any trading decisions. Duty AI explicitly
            disclaims any liability for actions taken based on the app's
            content.
          </Text>

          <Text style={styles.subheading}>9. Prohibited Activities</Text>
          <Text style={styles.paragraph}>
            Users must not engage in illegal, abusive, or fraudulent activities
            while using Duty AI. The app may suspend or terminate access for
            violations.
          </Text>

          <Text style={styles.subheading}>10. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All intellectual property rights related to Duty AI, including its
            content and algorithms, belong to the app's developers.
          </Text>

          <Text style={styles.subheading}>11. Updates and Modifications</Text>
          <Text style={styles.paragraph}>
            Duty AI reserves the right to update or modify these terms as
            necessary. Users are advised to review the terms periodically.
          </Text>

          <Text style={styles.subheading}>12. Support and Contact</Text>
          <Text style={styles.paragraph}>
            For any questions, support requests, or reports of technical issues,
            users may contact us at support@dutybd.com.
          </Text>

          <Text style={styles.paragraph}>
            By using Duty AI, users acknowledge that the app is intended for
            educational purposes only. Duty AI is not responsible for financial
            decisions or outcomes derived from the use of its features.
            Continued use of the app constitutes your acceptance of these terms.
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={handlePress}>
          <LinearGradient
            colors={["#4E73DF", "#8E44AD"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>I Agree</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // To leave space for the button
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default TermsAndConditions;
