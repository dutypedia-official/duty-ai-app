import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  AlarmBottomSheet,
  getPrice,
  StockListItem,
} from "../../app/main/discover/chart/index";
import { useAuth } from "@clerk/clerk-expo";
import { apiClient } from "@/lib/api";
import { useRouter } from "expo-router";
import useUi from "@/lib/hooks/useUi";
import { useThemeColor } from "../Themed";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import useStockData from "@/lib/hooks/useStockData";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import MagicInactiveDark from "../svgs/magicInactiveDark";
import MagicInactiveLight from "../svgs/magicInactiveLight";
import MagicIcon from "../svgs/magic";
import Toast from "react-native-toast-message";

const Favorite = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { getToken } = useAuth();
  const [isLoading2, setIsLoading2] = useState(true);
  const client = apiClient();
  const { favorites, setFavorites } = useStockData();
  const {
    refreash,
    refreashFav,
    selectedStock,
    mainServerAvailable,
    setRefreash,
    setRefreashFav,
  } = useUi();
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [alerms, setAlerms] = useState([]);
  const [aiAlerms, setAiAlerms] = useState([]);
  const [activeTab, setActiveTab] = useState("priceAlarm");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get("/tools/get-favs", token);
      const { data: alermData } = await client.get("/noti/get-alerms", token);
      setAlerms(alermData);
      setFavorites(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading2(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreashFav]);

  const fetchAlerms = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/noti/get-alerms",
        token,
        {},
        mainServerAvailable
      );

      setAlerms(data?.alerms);
      setAiAlerms(data?.aiAlerms);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // const handelSetAlerm = async () => {
  //   if (!selectedStock) {
  //     return Toast.show({
  //       type: "error",
  //       text1: "Select a stock first!",
  //     });
  //   }
  //   try {
  //     setLoading(true);
  //     const token = await getToken();
  //     if (+selectedStock?.price?.replace(",", "") === parseFloat(targetPrice)) {
  //       return Toast.show({
  //         type: "error",
  //         text1: "Price is same as current price!",
  //       });
  //     }
  //     await client.post(
  //       "/noti/create-alerm",
  //       {
  //         price: parseFloat(targetPrice),
  //         symbol: selectedStock?.name,
  //         condition:
  //           parseFloat(targetPrice) > +selectedStock?.price?.replace(",", "")
  //             ? "Up"
  //             : "Down",
  //       },
  //       token,
  //       mainServerAvailable
  //     );

  //     Toast.show({
  //       type: "success",
  //       text1: "Alarm set successfully",
  //     });

  //     setRefreash(!refreash);

  //     // hideModal();
  //     bottomSheetRef.current?.close();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handelSetAiAlerm = async () => {
  //   if (!selectedStock) {
  //     return Toast.show({
  //       type: "error",
  //       text1: "Select a stock first!",
  //     });
  //   }
  //   try {
  //     setError(null);
  //     setLoading(true);
  //     const token = await getToken();
  //     await client.post(
  //       "/noti/create-ai-alerm",
  //       {
  //         symbol: selectedStock?.name,
  //         prompt: inputText,
  //       },
  //       token,
  //       mainServerAvailable
  //     );

  //     Toast.show({
  //       type: "success",
  //       text1: "Alarm set successfully",
  //     });

  //     setRefreash(!refreash);

  //     // hideModal();
  //     bottomSheetRef.current?.close();
  //   } catch (error: any) {
  //     console.log(error.response?.data);
  //     setError(error.response?.data?.detail);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handelDeleteAlerm = async () => {
  //   try {
  //     setLoading(true);
  //     const token = await getToken();
  //     await client.delete(
  //       `/noti/delete-alerm/${currentAlarm.id}`,
  //       token,
  //       {},
  //       mainServerAvailable
  //     );
  //     Toast.show({
  //       type: "success",
  //       text1: "Alarm deleted successfully",
  //     });
  //     setRefreash(!refreash);
  //     setRefreashFav(!refreashFav);
  //     // hideModal();
  //     bottomSheetRef.current?.close();
  //   } catch (error) {
  //     console.log(error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error deleting alarm",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handelDeleteAiAlerm = async () => {
  //   try {
  //     setLoading(true);
  //     const token = await getToken();
  //     await client.delete(
  //       `/noti/delete-ai-alerm/${selectedStock.name}`,
  //       token,
  //       {},
  //       mainServerAvailable
  //     );
  //     Toast.show({
  //       type: "success",
  //       text1: "Alarm deleted successfully",
  //     });
  //     setRefreash(!refreash);
  //     setRefreashFav(!refreashFav);
  //     // hideModal();
  //     bottomSheetRef.current?.close();
  //   } catch (error) {
  //     console.log(error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error deleting alarm",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAlerms();
  // }, [refreash]);

  // const currentAlarm: any = alerms?.find(
  //   (alerm: any) => alerm.symbol === companyName
  // );
  // const currentAiAlerm: any = aiAlerms?.find(
  //   (alerm: any) => alerm.symbol === companyName
  // );

  // const [targetPrice, setTargetPrice] = useState(
  //   currentAlarm ? `${currentAlarm?.price}` : ""
  // );

  // // Reference for the bottom sheet
  const bottomSheetRef = useRef<any>(null);

  // // Snap points define the collapsed and expanded heights of the bottom sheet
  // const snapPoints = useMemo(() => ["70%"], []);

  // const renderBackdrop = (props: BottomSheetBackdropProps) => (
  //   <BottomSheetBackdrop
  //     {...props}
  //     disappearsOnIndex={-1} // Disappears when fully collapsed
  //     appearsOnIndex={0} // Appears when opened
  //     opacity={isDark ? 0.6 : 0.3} // Set the backdrop opacity
  //   />
  // );
  return (
    <View style={{ paddingHorizontal: 12, backgroundColor: bgColor }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
          alignItems: "center",
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#D2D2D2" : "black",
          }}>
          Favorites <AntDesign name="heart" size={20} color="#ff3e30" />
        </Text>
      </View>

      {favorites?.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({ item }: any) => (
            <StockListItem
              name={item.symbol}
              price={getPrice(item)}
              change={item.change}
              logoUrl={`https://s3-api.bayah.app/cdn/symbol/logo/${item.symbol}.svg`}
              volume={item.volume}
              alerms={alerms}
              favs={favorites}
              trading={item.trade}
              value={item.value}
              changePer={item.changePer}
              onFavList={true}
              setCompanyName={setCompanyName}
              sheetRef={bottomSheetRef}
            />
          )}
        />
      ) : (
        <View
          style={{
            paddingRight: 20,
            alignItems: "center",
            paddingTop: 50,
            backgroundColor: "transparent",
          }}>
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              paddingVertical: 12,
              color: isDark ? "#D2D2D2" : "black",
            }}>
            No favorites stock. Click to add
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/main/discover/chart/");
            }}
            style={{
              alignItems: "center",
              position: "relative",
              backgroundColor: "transparent",
            }}>
            <LinearGradient
              colors={
                isDark
                  ? ["#282828", "#1F1F1F", "#181818"]
                  : ["#e5e5e0", "#e0e0e0", "#e5e5e0"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                alignItems: "center",
                width: "auto",
                height: "auto",
                borderRadius: 4,
                opacity: 0.9,
                padding: 8,
              }}>
              <Text
                style={{
                  opacity: 0.7,
                  color: isDark ? "white" : "black",
                }}>
                <MaterialIcons
                  name="addchart"
                  size={38}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                />
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "transparent" }}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => <View style={{ display: "none" }}></View>}
        style={{
          backgroundColor: "transparent",
        }}>
        <AlarmBottomSheet
          bottomSheetRef={bottomSheetRef}
          isDark={isDark}
          currentAlarm={currentAlarm}
          setActiveTab={activeTab}
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
          handelDeleteAlerm={handelDeleteAlerm}
          handelSetAiAlerm={handelSetAiAlerm}
          handelDeleteAiAlerm={handelDeleteAiAlerm}
        />
      </BottomSheet> */}
    </View>
  );
};
export default Favorite;
