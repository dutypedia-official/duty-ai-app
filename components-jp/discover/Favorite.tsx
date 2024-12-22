import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  getPrice,
  StockListItem,
} from "../../app/main-jp/discover/chart/index";
import { useThemeColor } from "../Themed";

const Favorite = ({
  bottomSheetRef,
  setCompanyName,
  favorites,
  alerms,
  aiAlerms,
}: {
  bottomSheetRef: any;
  setCompanyName: any;
  favorites: any;
  alerms: any;
  aiAlerms?: any;
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");

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
          お気に入り <AntDesign name="heart" size={20} color="#ff3e30" />
        </Text>
      </View>

      {favorites?.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({ item }: any) => (
            <StockListItem
              aiAlerms={aiAlerms}
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
              bottomSheetRef={bottomSheetRef}
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
            お気に入りがありません。クリックして追加
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/main-jp/discover/chart/");
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
    </View>
  );
};
export default Favorite;
