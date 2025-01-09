import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import {
  SafeAreaView,
  View as ThemedView,
  useThemeColor,
} from "@/components-jp/Themed";
import { Button, Card, Text } from "react-native-paper";
import { useRef, useState } from "react";
import { discoverData, discoverDataBn, pastelColors } from "@/lib/dataStore";
import * as Haptics from "expo-haptics";
import useChat from "@/lib/hooks/useChat";
import { useRouter } from "expo-router";
import useLang from "@/lib/hooks/useLang";

interface Props {
  onCategoryChanged: (category: string) => void;
}
export default function DiscoverScreen() {
  const { language } = useLang();
  const isBn = language === "bn";
  const categoriesData = isBn ? discoverDataBn : discoverData;
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<any | null>>([]);
  const bgColor = useThemeColor({}, "cardBg");
  const { setTemplate, template, setActiveConversationId } = useChat();
  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x: number) => {
      if (Platform.OS === "ios") {
        scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // onCategoryChanged(categories[index].name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
        }}>
        {colorScheme === "dark" && (
          <Image
            style={{
              height: 250,
              width: "100%",
              position: "absolute",
              bottom: -100,
              opacity: colorScheme === "dark" ? 1 : 0.5,
            }}
            resizeMode="cover"
            source={require("@/assets/images/chart.png")}
          />
        )}
        {colorScheme === "light" && (
          <Image
            style={{
              height: 250,
              width: "100%",
              position: "absolute",
              bottom: -100,
              opacity: 0.5,
            }}
            resizeMode="cover"
            source={require("@/assets/images/chart-white.png")}
          />
        )}
      </View>
      <ScrollView
        style={{
          flex: 1,
        }}>
        {/* <ScrollView
          style={{
            flexGrow: 0,
            marginVertical: 24,
            flexShrink: 0,
          }}
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-start",
            alignSelf: "flex-start",
            gap: 12,
          }}
        >
          {discoverData.map((item, index) => (
            <Button
              icon={item.icon}
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={{
                borderRadius: 100,
                borderWidth: 1,
                marginLeft: index === 0 ? 12 : 0,
                marginRight: index === discoverData.length - 1 ? 12 : 0,
              }}
              labelStyle={{
                fontSize: 14,
                marginHorizontal: 20,
                marginVertical: 8,
              }}
              contentStyle={{ paddingVertical: 0 }}
              mode={activeIndex === index ? "contained" : "outlined"}
              onPress={() => selectCategory(index)}
            >
              {item.category}
            </Button>
          ))}
        </ScrollView> */}
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 20,
          }}>
          {!isBn && (
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
              }}>
              <Text style={{ color: "#0094FF", fontWeight: "bold" }}>
                Bangladesh{"\n"}Stocks
              </Text>{" "}
              or{" "}
              <Text style={{ color: "#0094FF", fontWeight: "bold" }}>
                Forex{"\n"}
              </Text>
              Select What You Want to Analyze
            </Text>
          )}
          {isBn && (
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
              }}>
              <Text style={{ color: "#0094FF", fontWeight: "bold" }}>
                বাংলাদেশ শেয়ার{"\n"}বাজার
              </Text>{" "}
              বা{" "}
              <Text style={{ color: "#0094FF", fontWeight: "bold" }}>
                ফরেক্স{"\n"}
              </Text>
              আপনার যা দরকার তা নির্বাচন করুন
            </Text>
          )}
        </View>
        <ScrollView style={{ paddingHorizontal: 12 }}>
          <View style={{ gap: 16, paddingBottom: 20 }}>
            {categoriesData[activeIndex].data.map((item: any, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.link) {
                    router.push(item.link);
                  } else {
                    setTemplate(item.template);
                    setActiveConversationId(null);
                    router.push("/main-jp/home");
                  }
                }}
                key={index}>
                <Card
                  mode="contained"
                  style={{ backgroundColor: item.bgColor || bgColor }}>
                  <Card.Content>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 100,
                          backgroundColor:
                            item.iconBgColor ||
                            pastelColors[index % pastelColors.length],
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        {item.icon}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{ color: "#FFF" }}
                          numberOfLines={1}
                          variant="titleLarge">
                          {item.title}
                        </Text>
                        <Text
                          style={{ color: "#00D1FF" }}
                          numberOfLines={2}
                          variant="bodyMedium">
                          {item.subTitle}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
