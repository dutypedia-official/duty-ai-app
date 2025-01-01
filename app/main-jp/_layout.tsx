import { useThemeColor } from "@/components/Themed";
import { apiClient } from "@/lib/api";
import useChat from "@/lib/hooks/useChat";
import useFeedData from "@/lib/hooks/useFeedData";
import useLang from "@/lib/hooks/useLang";
import useStockData from "@/lib/hooks/useStockData";
import useUi from "@/lib/hooks/useUi";
import { useAuth } from "@clerk/clerk-expo";
import {
  default as IonIcon,
  default as Ionicons,
} from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useIsFocused } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Tabs, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  } = useUi();
  const isBn = language === "Bn";
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
      ["details", "vipsignal", "scanner"].includes(segment)
    );
    setHideTabBar(shouldHide);

    if (shouldHide) {
      setTemplate("scanner");
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
  //       "/tools/get-stock-market-jp",
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
        `/tools/get-jp-index`,
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

  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={({ route }) => ({
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
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: isBn ? "অনুসন্ধান" : "Discover",
          headerShown: false,
          unmountOnBlur: false,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: isBn ? "চ্যাট" : "Stock Analysis",
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: isBn ? "নোটিফিকেশান" : "Notification",

          tabBarBadge: count > 10 ? "10+" : count > 0 ? count : undefined,
          headerStyle: {
            backgroundColor: bgColor,
            borderBottomWidth: 0.7,
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: isBn ? "সেটিং" : "Setting",
          headerShown: false,
        }}
      />
    </Tabs>
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

function MyTabBar({ state, descriptors, navigation }: any) {
  const colorScheme = useColorScheme();
  const inset = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const bgColor = colorScheme === "dark" ? "#121212" : "white";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null; // Hide the tab bar
  }
  return (
    <View
      style={[
        styles.tabbar,
        { backgroundColor: bgColor, paddingBottom: inset.bottom },
      ]}>
      {state.routes.map((route: any, index: any) => {
        const Icon: any = {
          feed: (props: any) => (
            <View
              style={{
                width: "100%",
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <SimpleLineIcons
                name="feed"
                size={20}
                style={{ marginBottom: -3 }}
                {...props}
              />
            </View>
          ),
          discover: (props: any) => (
            <View
              style={{
                width: "100%",
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Ionicons
                name="compass-outline"
                size={28}
                style={{ marginBottom: -3 }}
                {...props}
              />
            </View>
          ),
          home: (props: any) => {
            const isFocused = state.index === index;
            return (
              <View
                style={{
                  width: "100%",
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {isFocused ? (
                  colorScheme === "dark" ? (
                    <SvgXml xml={svgActiveDark} width={22} height={22} />
                  ) : (
                    <SvgXml xml={svgActive} width={22} height={22} />
                  )
                ) : (
                  <SvgXml xml={svg} width={22} height={22} />
                )}
              </View>
            );
          },
          notification: (props: any) => (
            <View
              style={{
                width: "100%",
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Ionicons
                name="notifications-outline"
                size={28}
                style={{ marginBottom: -3 }}
                {...props}
              />
            </View>
          ),
          setting: (props: any) => (
            <View
              style={{
                width: "100%",
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Ionicons
                name="cog"
                size={28}
                style={{ marginBottom: -3 }}
                {...props}
              />
            </View>
          ),
        };

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItems}>
            {Icon[route.name]({
              color: isFocused ? "#006c46" : "#7C7C7C",
            })}
            <Text
              style={{
                color: isFocused ? "#006c46" : "#7C7C7C",
                textAlign: "center",
                fontSize: 10,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    paddingTop: 10,
  },
  tabbarItems: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 5,
  },
});
