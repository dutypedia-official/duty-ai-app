import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  GestureResponderEvent,
  ActivityIndicator,
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
    router.replace("/main-jp/home"); // Perform the navigation
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
          <Text style={styles.heading}>Duty AI 利用規約</Text>

          <Text style={styles.subheading}>1. 利用契約</Text>
          <Text style={styles.paragraph}>
            Duty AI
            を利用することで、ユーザーは本規約に同意し、アプリの使用およびその機能に関する規定を遵守することを確認します。
          </Text>

          <Text style={styles.subheading}>2.教育目的</Text>
          <Text style={styles.paragraph}>
            Duty AI
            は、株式市場に関する洞察や分析を提供する教育ツールとして設計されています。本アプリの全機能、シグナル、および通知は、情報提供および教育目的のみに利用されるものとします。
          </Text>

          <Text style={styles.subheading}>3. 金銭的責任の免責</Text>
          <Text style={styles.paragraph}>
            Duty AI
            が提供する分析、予測、およびシグナルは、教育目的のみに基づくものであり、財務上の判断や決定についてはユーザー自身の判断と責任に委ねられます。Duty
            AI
            およびその開発者は、本アプリの利用により発生した利益または損失を含む財務結果について一切責任を負いません。
          </Text>

          <Text style={styles.subheading}>4. アカウントの責任</Text>
          <Text style={styles.paragraph}>
            個別の体験を提供するためにアカウントの作成が必要な場合があります。アカウント情報の管理とその機密性の保持は、ユーザーの責任となります。
          </Text>

          <Text style={styles.subheading}>5. データ利用</Text>
          <Text style={styles.paragraph}>
            Duty AI
            は、円滑でパーソナライズされた体験を提供するために必要最低限のデータを収集します。このデータは適切な手段で保護されます。本アプリを利用することで、プライバシーポリシーに記載されたデータ収集に同意したものとみなされます。
          </Text>

          <Text style={styles.subheading}>6. ユーザー生成コンテンツ</Text>
          <Text style={styles.paragraph}>
            ユーザーがプラットフォーム内で生成または共有するコンテンツについては、全責任がユーザーにあります。Duty
            AI
            は、不適切または本規約に違反するコンテンツを管理または削除する権利を有します。
          </Text>

          <Text style={styles.subheading}>7. 通知およびアラート</Text>
          <Text style={styles.paragraph}>
            Duty AI
            が提供する通知およびトレード分析は、教育目的の機能の一部です。これらは投資助言や株式の売買の推奨として解釈されるべきではありません。Duty
            AI
            は、これらの通知や分析の正確性、完全性、信頼性について保証しません。
          </Text>

          <Text style={styles.subheading}>8. リスクに関する免責事項</Text>
          <Text style={styles.paragraph}>
            株式市場は本質的に変動性が高く、重大なリスクを伴います。ユーザーは、投資決定を行う前に専門の金融アドバイザーに相談することを強く推奨します。Duty
            AI
            は、本アプリの内容に基づいて行動した結果について明示的に責任を負いません。
          </Text>

          <Text style={styles.subheading}>9. 禁止行為</Text>
          <Text style={styles.paragraph}>
            Duty AI
            を利用する際、違法行為、虐待的行為、または詐欺的行為を行ってはなりません。規約違反が確認された場合、アプリの利用を停止または終了する権利を有します。
          </Text>

          <Text style={styles.subheading}>10. 知的財産権</Text>
          <Text style={styles.paragraph}>
            Duty AI
            に関連するコンテンツやアルゴリズムを含むすべての知的財産権は、アプリの開発者に帰属します。
          </Text>

          <Text style={styles.subheading}>11. 更新および変更</Text>
          <Text style={styles.paragraph}>
            Duty AI
            は必要に応じて本規約を更新または変更する権利を有します。ユーザーは定期的に規約を確認することを推奨します。
          </Text>

          <Text style={styles.subheading}>12. サポートとお問い合わせ</Text>
          <Text style={styles.paragraph}>
            ご質問、サポートの依頼、または技術的な問題の報告については、
            <Text style={styles.link}>duty.com.bd@gmail.com</Text>
            までお問い合わせください。
          </Text>

          <Text style={styles.subheading}>最終的な確認最終的な確認</Text>
          <Text style={styles.paragraph}>
            Duty AI
            を利用することで、ユーザーは本アプリが教育目的のみに設計されていることを理解したとみなされます。Duty
            AI
            は、その機能の利用に基づく財務上の決定または結果について責任を負いません。本アプリを継続して使用することで、ユーザーは本規約に同意したものとみなされます。
          </Text>
        </ScrollView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
          onPress={handlePress}>
          <LinearGradient
            colors={["#4E73DF", "#8E44AD"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>私は同意した</Text>
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
  link: {
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  button: {
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
