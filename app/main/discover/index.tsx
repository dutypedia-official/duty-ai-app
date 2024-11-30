import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  useColorScheme,
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
import SheetCard from "@/components/SheetCard";
import Toast from "react-native-toast-message";
import { useAuth } from "@clerk/clerk-expo";
import { apiClient } from "@/lib/api";
import useStockData from "@/lib/hooks/useStockData";
import BottomSheet from "@gorhom/bottom-sheet";
import { Portal } from "react-native-paper";

interface Props {
  onCategoryChanged: (category: string) => void;
  params: any;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const { redirectToList, next } = useLocalSearchParams();
  const {
    setRefreash,
    refreash,
    setScreenRefresh,
    screenRefresh,
    refreashFav,
    setRefreashFav,
    selectedStock,
    mainServerAvailable,
  } = useUi();
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

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { getToken } = useAuth();
  const [isLoading2, setIsLoading2] = useState(true);
  const client = apiClient();
  const { favorites, setFavorites } = useStockData();
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(false);
  const [loadingDeleteAlarm, setLoadingDeleteAlarm] = useState(false);
  const [loadingAiAlarm, setLoadingAiAlarm] = useState(false);
  const [loadingDeleteAiAlarm, setLoadingDeleteAiAlarm] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [alerms, setAlerms] = useState([]);
  const [aiAlerms, setAiAlerms] = useState([]);
  const [activeTab, setActiveTab] = useState("priceAlarm");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get("/tools/get-favs", token);
      const { data: alermData } = await client.get("/noti/get-alerms", token);
      setAlerms(alermData?.alerms);
      setFavorites(data);
      setAiAlerms(alermData?.aiAlerms);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading2(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreashFav]);

  const handelSetAlerm = async () => {
    if (!selectedStock) {
      return Toast.show({
        type: "error",
        text1: "Select a stock first!",
      });
    }
    try {
      setLoading(true);
      const token = await getToken();
      if (+selectedStock?.price?.replace(",", "") === parseFloat(targetPrice)) {
        return Toast.show({
          type: "error",
          text1: "Price is same as current price!",
        });
      }
      await client.post(
        "/noti/create-alerm",
        {
          price: parseFloat(targetPrice),
          symbol: selectedStock?.name,
          condition:
            parseFloat(targetPrice) > +selectedStock?.price?.replace(",", "")
              ? "Up"
              : "Down",
        },
        token,
        mainServerAvailable
      );

      Toast.show({
        type: "success",
        text1: "Alarm set successfully",
      });

      setRefreash(!refreash);
      setRefreashFav(!refreashFav);

      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelSetAiAlerm = async () => {
    if (!selectedStock) {
      return Toast.show({
        type: "error",
        text1: "Select a stock first!",
      });
    }
    try {
      setError(null);
      setLoadingAiAlarm(true);
      const token = await getToken();
      await client.post(
        "/noti/create-ai-alerm",
        {
          symbol: selectedStock?.name,
          prompt: inputText,
        },
        token,
        mainServerAvailable
      );

      Toast.show({
        type: "success",
        text1: "Alarm set successfully",
      });

      setRefreash(!refreash);
      setRefreashFav(!refreashFav);

      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error: any) {
      console.log(error.response?.data);
      setError(error.response?.data?.detail);
    } finally {
      setLoadingAiAlarm(false);
    }
  };

  const handelDeleteAlerm = async () => {
    try {
      setLoadingDeleteAlarm(true);
      const token = await getToken();
      await client.delete(
        `/noti/delete-alerm/${currentAlarm.id}`,
        token,
        {},
        mainServerAvailable
      );
      Toast.show({
        type: "success",
        text1: "Alarm deleted successfully",
      });
      setRefreash(!refreash);
      setRefreashFav(!refreashFav);
      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error deleting alarm",
      });
    } finally {
      setLoadingDeleteAlarm(false);
    }
  };
  const handelDeleteAiAlerm = async () => {
    try {
      setLoadingDeleteAiAlarm(true);
      const token = await getToken();
      await client.delete(
        `/noti/delete-ai-alerm/${selectedStock.name}`,
        token,
        {},
        mainServerAvailable
      );
      Toast.show({
        type: "success",
        text1: "Alarm deleted successfully",
      });
      setRefreash(!refreash);
      setRefreashFav(!refreashFav);
      // hideModal();
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error deleting alarm",
      });
    } finally {
      setLoadingDeleteAiAlarm(false);
    }
  };

  const currentAlarm: any = alerms?.find(
    (alerm: any) => alerm.symbol === companyName
  );
  const currentAiAlerm: any = aiAlerms?.find(
    (alerm: any) => alerm.symbol === companyName
  );

  const [targetPrice, setTargetPrice] = useState(
    currentAlarm ? `${currentAlarm?.price}` : ""
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView ref={scrollRef}>
        <DiscoverHistory />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <DiscoverCategory />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <VipSignal />
        <View style={{ marginTop: 24, backgroundColor: "transparent" }} />
        <Favorite
          bottomSheetRef={bottomSheetRef}
          setCompanyName={setCompanyName}
          alerms={alerms}
          aiAlerms={aiAlerms}
          favorites={favorites}
        />
        {/* <PopularPrompts /> */}
      </ScrollView>
      {/* <Portal> */}
      <SheetCard
        bottomSheetRef={bottomSheetRef}
        currentAlarm={currentAlarm}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        textColor={textColor}
        targetPrice={targetPrice}
        setTargetPrice={setTargetPrice}
        inputText={inputText}
        currentAiAlerm={currentAiAlerm}
        setInputText={setInputText}
        error={error}
        handelSetAlerm={handelSetAlerm}
        loading={loading}
        loadingDeleteAlarm={loadingDeleteAlarm}
        loadingAiAlarm={loadingAiAlarm}
        loadingDeleteAiAlarm={loadingDeleteAiAlarm}
        handelDeleteAlerm={handelDeleteAlerm}
        handelSetAiAlerm={handelSetAiAlerm}
        handelDeleteAiAlerm={handelDeleteAiAlerm}
      />
      {/* </Portal> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
