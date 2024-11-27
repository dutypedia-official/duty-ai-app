import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import DiscoverCategory from "@/components/discover/DiscoverCategory";
import DiscoverHistory from "@/components/discover/DiscoverHistory";
import Favorite from "@/components/discover/Favorite";
import useChat from "@/lib/hooks/useChat";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, useThemeColor } from "../../../components/Themed";
import useUi from "@/lib/hooks/useUi";
import VipSignal from "@/components/discover/VipSignal";
import useVipSignal from "@/lib/hooks/useVipSignal";
import { useIsFocused } from "@react-navigation/native";

interface Props {
  onCategoryChanged: (category: string) => void;
  params: any;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const { redirectToList, next } = useLocalSearchParams();
  const { setRefreash, refreash, setScreenRefresh, screenRefresh } = useUi();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<any | null>>([]);
  const bgColor = useThemeColor({}, "background");
  const { setTemplate, template, setActiveConversationId } = useChat();
  const { setAnswer, clearSelectStock } = useVipSignal();
  const isFocused = useIsFocused();

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x: number) => {
      if (Platform.OS === "ios") {
        scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onRefresh = useCallback(() => {
    setScreenRefresh(true);
    setTimeout(() => {
      setScreenRefresh(false);
    }, 2000);
  }, []);

  useEffect(() => {
    console.log(redirectToList, "-----------", next);

    if (redirectToList == "yes") {
      console.log(redirectToList);

      router.push("/main/discover/chart/");
    } else if (next == "scanner") {
      router.push("/main/discover/scanner/");
    }
  }, []);

  useEffect(() => {
    clearSelectStock();
    setAnswer(null);
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView ref={scrollRef}>
        <DiscoverHistory />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <DiscoverCategory />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <VipSignal />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <Favorite />
        {/* <PopularPrompts /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
