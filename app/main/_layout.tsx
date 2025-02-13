import { SafeAreaView, useThemeColor, View } from "@/components/Themed";
import { apiClient, apiClientPortfolio } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useFeedData from "@/lib/hooks/useFeedData";
import useLang from "@/lib/hooks/useLang";
import useStockData from "@/lib/hooks/useStockData";
import useUi from "@/lib/hooks/useUi";
import { useAuth, useUser } from "@clerk/clerk-expo";
import IonIcon from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Link, Tabs, usePathname, useRouter, useSegments } from "expo-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  useColorScheme,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SvgXml } from "react-native-svg";
import Colors from "../../constants/Colors";
import PagerView from "react-native-pager-view";
import Feed from "./feed";
import DiscoverScreen from "./discover";
import SettingScreen from "./home/setting";
import ChatScreen from "./home";
import Noti from "./notification";
import ChangeMarket from "./home/setting/change-market";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof IonIcon>["name"];
  color: string;
}) {
  return <IonIcon size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIconLine(props: {
  name: React.ComponentProps<typeof SimpleLineIcons>["name"];
  color: string;
}) {
  return <SimpleLineIcons size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const clientPortfolio = apiClientPortfolio();
  const [count, setCount] = useState(0);
  const colorScheme = useColorScheme();
  const langStore = useLang();
  const { language, setLanguage } = langStore;
  const {
    refreash,
    screenRefresh,
    mainServerAvailable,
    hideTabNav,
    setHideTabNav,
    portfolioStatus,
  } = useUi();
  const isBn = language === "bn";
  const segments: any = useSegments();
  const isFocused = useIsFocused();
  const client = apiClient();
  const pathname = usePathname();
  const { setIsLoading, isLoading, setMarketData, setFavorites, favorites } =
    useStockData();
  const { setIndexData } = useFeedData();
  const { setHistories } = useChat();
  const isDark = colorScheme === "dark";
  const bgColor = useThemeColor({}, "background");
  const [hideTabBar, setHideTabBar] = useState(false);
  const { setTemplate } = useChat();
  const router = useRouter();

  useEffect(() => {
    setHideTabNav(false);
    const shouldHide = segments.some((segment: string) =>
      ["details", "vipsignal", "scanner", "change-market", "terms"].includes(
        segment
      )
    );
    setHideTabBar(shouldHide);
    if (pathname.includes("scanner")) {
      setTemplate("scanner");
    }
    if (pathname === "/main-jp/home") {
      setTemplate("finance");
    }
  }, [segments, isFocused, router]);

  const getUnreadNotiCount = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/noti/get-unread-count",
        token,
        {},
        mainServerAvailable
      );
      setCount(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUnreadNotiCount();
  }, [refreash]);

  // const fetchData = async () => {
  //   try {
  //     const { data: mData } = await client.get(
  //       "/tools/get-stock-market",
  //       null,
  //       {},
  //       mainServerAvailable
  //     );
  //     setMarketData(mData);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(!isLoading);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //   console.log("fetching data stock list");
  // }, []);

  const fetchDataFeed = async (init: boolean = true) => {
    try {
      const { data } = await client.get(
        `/tools/get-dsebd-index`,
        null,
        {},
        mainServerAvailable
      );
      setIndexData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataFeed();
    console.log("fetching data feed");
  }, []);

  const fetchDataHistory = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/messages/conv/get-all",
        token,
        {},
        mainServerAvailable
      );

      setHistories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataHistory();
    console.log("fetching data history");
  }, []);

  const fetchFavs = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        "/tools/get-favs",
        token,
        {},
        mainServerAvailable
      );
      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFavs();
    console.log("fetching data fev");
  }, []);

  const logoUrl = user?.imageUrl;

  console.log(
    "portfolio initial route",
    !portfolioStatus ? "welcome-portfolio" : "index"
  );
  // const pagerRef = useRef<PagerView>(null);
  // const [currentPage, setCurrentPage] = useState(2);

  // // // Function to update PagerView and URL
  // const goToPage = (index: number, route: string) => {
  //   pagerRef.current?.setPage(index);
  //   setCurrentPage(index);
  //   //@ts-ignore
  //   router.push(route); // Sync the URL with the tab
  // };

  // const insets = useSafeAreaInsets();
  return (
    <Fragment>
      {/* <PagerView
        ref={pagerRef}
        initialPage={2}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        style={{ flex: 1, marginBottom: insets.bottom }}>
        <Feed />
        <DiscoverScreen />
        <ChatScreen />
        <Noti />
        <SettingScreen />
      </PagerView>
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          bottom: insets.bottom,
          justifyContent: "center",
        }}>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "blue",
            flex: 1,
            justifyContent: "center",
            position: "relative",
          }}
          onPress={() => goToPage(0, "/main/feed")}>
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
            }}>
            Go
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "blue",
            flex: 1,
            justifyContent: "center",
            position: "relative",
          }}
          onPress={() => goToPage(1, "/main/discover")}>
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
            }}>
            Go
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "blue",
            flex: 1,
            justifyContent: "center",
            position: "relative",
          }}
          onPress={() => goToPage(4, "/main/setting")}>
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
            }}>
            Go
          </Text>
        </TouchableOpacity>
      </View> */}
      <Tabs
        screenOptions={({ route }) => ({
          animation: "shift",
          headerStyle: {
            backgroundColor: bgColor,
          },
          tabBarStyle: {
            display: hideTabBar || hideTabNav ? "none" : "flex",
            backgroundColor: colorScheme === "dark" ? "#121212" : "white",
          },
          height: hideTabBar ? 0 : undefined,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          tabBarHideOnKeyboard: Platform.OS === "ios" ? false : true,
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint={colorScheme === "dark" ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ),
        })}>
        <Tabs.Screen
          name="feed"
          options={{
            title: isBn ? "ফিড" : "Feed",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIconLine name="feed" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="discover"
          options={{
            title: isBn ? "অনুসন্ধান" : "Discover",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="compass-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: isBn ? "চ্যাট" : "Stock Analysis",
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                colorScheme === "dark" ? (
                  <SvgXml xml={svgActiveDark} width={22} height={22} />
                ) : (
                  <SvgXml xml={svgActive} width={22} height={22} />
                )
              ) : (
                <SvgXml xml={svg} width={22} height={22} />
              ),
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: isBn ? "নোটিফিকেশান" : "Notification",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="notifications-outline" color={color} />
            ),
            tabBarBadge: count > 10 ? "10+" : count > 0 ? count : undefined,
            headerStyle: {
              backgroundColor: bgColor,
              borderBottomWidth: 0.7,
            },
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="portfolio"
          // listeners={() => {
          //   return {
          //     tabPress: (e) => {
          //       e.preventDefault();
          //       portfolioStatus === null
          //         ? router.push("/main/portfolio/welcome-portfolio")
          //         : router.push("/main/portfolio/portfolio");
          //     },
          //   };
          // }}
          options={{
            title: isBn ? "পোর্টফলিও" : "Portfolio",
            headerShown: false,
            tabBarIcon: ({ color, focused }) =>
              focused ? (
                <LinearGradient
                  colors={
                    isDark ? ["#C2FF58", "#C2FF58"] : ["#C2FF58", "#C2FF58"]
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    overflow: "hidden",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                  }}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 999,
                      alignContent: "center",
                      justifyContent: "center",
                    }}>
                    {!logoUrl && (
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 12,
                          color: "#1E1E1E",
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}>
                        {user?.firstName![0]}
                      </Text>
                    )}
                    {logoUrl && (
                      <Image
                        source={{ uri: logoUrl }}
                        style={{
                          borderRadius: 999,
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    )}
                  </View>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={
                    isDark ? ["#808080", "#808080"] : ["#808080", "#808080"]
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    overflow: "hidden",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 1,
                  }}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 999,
                      alignContent: "center",
                      justifyContent: "center",
                    }}>
                    {!logoUrl && (
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 12,
                          color: "#1E1E1E",
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}>
                        {user?.firstName![0]}
                      </Text>
                    )}
                    {logoUrl && (
                      <Image
                        source={{ uri: logoUrl }}
                        style={{
                          borderRadius: 999,
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    )}
                  </View>
                </LinearGradient>
              ),
          }}
        />
      </Tabs>
    </Fragment>
  );
}

const svg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.25 2H50.75C56.9632 2 62 7.0368 62 13.25V50.75C62 56.9632 56.9632 62 50.75 62H2V13.25C2 7.0368 7.0368 2 13.25 2Z" stroke="#7C7C7C" stroke-width="6"/>
<path d="M19.2944 41.7278L29.0355 31.9867L35.0088 37.96C35.7624 38.7136 36.9754 38.6768 37.6738 37.8865L50.8519 23.0543C51.4952 22.3375 51.4584 21.2347 50.7784 20.5363C50.6017 20.3602 50.3911 20.2219 50.1593 20.1298C49.9275 20.0378 49.6794 19.9938 49.4301 20.0007C49.1808 20.0076 48.9354 20.0651 48.7091 20.1699C48.4827 20.2746 48.28 20.4243 48.1134 20.6098L36.3689 33.8063L30.3221 27.7594C30.152 27.5891 29.9501 27.4539 29.7277 27.3616C29.5054 27.2694 29.267 27.2219 29.0263 27.2219C28.7856 27.2219 28.5473 27.2694 28.3249 27.3616C28.1026 27.4539 27.9006 27.5891 27.7306 27.7594L16.5375 38.9709C16.3671 39.1409 16.2319 39.3429 16.1397 39.5652C16.0475 39.7876 16 40.0259 16 40.2666C16 40.5074 16.0475 40.7457 16.1397 40.968C16.2319 41.1904 16.3671 41.3924 16.5375 41.5624L16.7029 41.7278C17.4197 42.4446 18.596 42.4446 19.2944 41.7278Z" fill="#7C7C7C"/>
</svg>`;

const svgActive = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.25 2H50.75C56.9632 2 62 7.0368 62 13.25V50.75C62 56.9632 56.9632 62 50.75 62H2V13.25C2 7.0368 7.0368 2 13.25 2Z" stroke="#006c46" stroke-width="6"/>
<path d="M19.2944 41.7278L29.0355 31.9867L35.0088 37.96C35.7624 38.7136 36.9754 38.6768 37.6738 37.8865L50.8519 23.0543C51.4952 22.3375 51.4584 21.2347 50.7784 20.5363C50.6017 20.3602 50.3911 20.2219 50.1593 20.1298C49.9275 20.0378 49.6794 19.9938 49.4301 20.0007C49.1808 20.0076 48.9354 20.0651 48.7091 20.1699C48.4827 20.2746 48.28 20.4243 48.1134 20.6098L36.3689 33.8063L30.3221 27.7594C30.152 27.5891 29.9501 27.4539 29.7277 27.3616C29.5054 27.2694 29.267 27.2219 29.0263 27.2219C28.7856 27.2219 28.5473 27.2694 28.3249 27.3616C28.1026 27.4539 27.9006 27.5891 27.7306 27.7594L16.5375 38.9709C16.3671 39.1409 16.2319 39.3429 16.1397 39.5652C16.0475 39.7876 16 40.0259 16 40.2666C16 40.5074 16.0475 40.7457 16.1397 40.968C16.2319 41.1904 16.3671 41.3924 16.5375 41.5624L16.7029 41.7278C17.4197 42.4446 18.596 42.4446 19.2944 41.7278Z" fill="#006c46"/>
</svg>`;

const svgActiveDark = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.25 2H50.75C56.9632 2 62 7.0368 62 13.25V50.75C62 56.9632 56.9632 62 50.75 62H2V13.25C2 7.0368 7.0368 2 13.25 2Z" stroke="#6ADDA4" stroke-width="6"/>
<path d="M19.2944 41.7278L29.0355 31.9867L35.0088 37.96C35.7624 38.7136 36.9754 38.6768 37.6738 37.8865L50.8519 23.0543C51.4952 22.3375 51.4584 21.2347 50.7784 20.5363C50.6017 20.3602 50.3911 20.2219 50.1593 20.1298C49.9275 20.0378 49.6794 19.9938 49.4301 20.0007C49.1808 20.0076 48.9354 20.0651 48.7091 20.1699C48.4827 20.2746 48.28 20.4243 48.1134 20.6098L36.3689 33.8063L30.3221 27.7594C30.152 27.5891 29.9501 27.4539 29.7277 27.3616C29.5054 27.2694 29.267 27.2219 29.0263 27.2219C28.7856 27.2219 28.5473 27.2694 28.3249 27.3616C28.1026 27.4539 27.9006 27.5891 27.7306 27.7594L16.5375 38.9709C16.3671 39.1409 16.2319 39.3429 16.1397 39.5652C16.0475 39.7876 16 40.0259 16 40.2666C16 40.5074 16.0475 40.7457 16.1397 40.968C16.2319 41.1904 16.3671 41.3924 16.5375 41.5624L16.7029 41.7278C17.4197 42.4446 18.596 42.4446 19.2944 41.7278Z" fill="#6ADDA4"/>
</svg>`;
