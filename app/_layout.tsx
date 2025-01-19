import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import Constants from "expo-constants";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { DarkScheme, LightScheme } from "@/constants/PaperColors";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import useSocket from "@/lib/hooks/useSocket";
import { apiClient, isServerAvailable, MAIN_SERVER_URL } from "@/lib/api";
import useUi from "@/lib/hooks/useUi";
import useLang from "@/lib/hooks/useLang";
import useMarket from "@/lib/hooks/useMarket";
import Toast from "react-native-toast-message";
import * as Localization from "expo-localization";

type SupportedLanguage = "en" | "bn" | "ja";

const CURRENT_IOS_VERSION = 11;
const CURRENT_ANDROID_VERSION = 11;

// const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.log(err);
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(start)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Please allow notification to get latest update!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function RootLayout() {
  const isRunningInExpoGo = Constants.appOwnership === "expo";
  const { connect, socket } = useSocket();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    connect();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={
        isRunningInExpoGo
          ? "pk_test_cHJvdmVuLWJsdWVnaWxsLTU0LmNsZXJrLmFjY291bnRzLmRldiQ"
          : "pk_live_Y2xlcmsuZHV0eWFpLmFwcCQ"
      }
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { setUpdateInfo, language, setLanguage } = useLang();
  const { isLoaded, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();
  const [update, setUpdate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();
  const client = apiClient();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const { setRefreash, refreash, mainServerAvailable, setMainServerAvailable } =
    useUi();
  const [expoPushToken, setExpoPushToken] = useState("");
  const { user } = useUser();
  const { getToken } = useAuth();
  const { selectMarket } = useMarket();

  const PaperLightTheme = {
    ...MD3LightTheme,
    colors: LightScheme,
  };

  const PaperDarkTheme = {
    ...MD3DarkTheme,
    colors: DarkScheme,
  };

  const PaperTheme = colorScheme === "dark" ? PaperDarkTheme : PaperLightTheme;
  SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#050505" : "#fff");

  const checkUpdate = async () => {
    try {
      const isAvailable = await isServerAvailable(MAIN_SERVER_URL);
      setMainServerAvailable(isAvailable);
      const { data } = Constants.platform?.ios
        ? await client.get(
            `/tools/check-for-update?version=${CURRENT_IOS_VERSION}&platform=ios`,
            null,
            {},
            isAvailable
          )
        : await client.get(
            `/tools/check-for-update?version=${CURRENT_ANDROID_VERSION}&platform=android`,
            null,
            {},
            isAvailable
          );
      console.log(data);

      setUpdateInfo(data);
      setUpdate(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => null);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (expoPushToken && user) {
      const saveToken = async () => {
        console.log("expoPushToken", expoPushToken);
        const userToken = await getToken();
        const isAvailable = await isServerAvailable(MAIN_SERVER_URL);
        await client.post(
          `/noti/save-token/${expoPushToken}`,
          {},
          userToken,
          {},
          isAvailable
        );
      };
      saveToken();
    }
  }, [expoPushToken, user]);

  useEffect(() => {
    if (socket && user) {
      socket.on(`new-noti-${user.id}`, () => {
        console.log("New noti...");
        setRefreash(!refreash);
      });
    }
    return () => {
      if (socket && user) {
        socket.off(`new-noti-${user.id}`);
      }
    };
  }, [socket, user]);

  useEffect(() => {
    checkUpdate();
  }, []);

  // Automatically set language if none is selected
  useEffect(() => {
    if (!language) {
      const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";
      const supportedLanguages = ["en", "bn", "ja"];
      const defaultLanguage = supportedLanguages.includes(deviceLanguage)
        ? deviceLanguage
        : "en";
      setLanguage(defaultLanguage);
    }
  }, [language, setLanguage]);

  useEffect(() => {
    if (isLoaded && !isLoading) {
      // Step 1: Check if the app needs to be updated
      if (update?.update) {
        router.replace("/update");
        return;
      }

      // Step 2: User is not signed in
      if (!isSignedIn) {
        // Redirect to language selection
        if (language === "ja") {
          router.replace("/(start-jp)");
        } else {
          router.replace("/(start)");
        }
      }
      // Step 3: User is signed in but has not selected a market
      else if (!selectMarket) {
        if (language === "ja") {
          router.replace("/(start-jp)/market");
        } else {
          router.replace("/(start)/market");
        }
      }
      // Step 4: User is signed in and has selected a market
      else {
        if (selectMarket === "Japan") {
          router.replace("/main-jp/home");
        } else {
          router.replace("/main/home");
          // router.replace("/main/setting/portfolio");
        }
      }
    }
  }, [isLoaded, isLoading, update, isSignedIn, selectMarket]);

  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";

  useEffect(() => {
    if (isLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, isLoading]);

  if (!isLoaded || isLoading) {
    return <StatusBar backgroundColor={Colors["light"].background} />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar backgroundColor={Colors[colorScheme ?? "dark"].background} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={PaperTheme}>
          <Stack>
            <Stack.Screen name="(start)" options={{ headerShown: false }} />
            <Stack.Screen name="(start-jp)" options={{ headerShown: false }} />
            <Stack.Screen name="main" options={{ headerShown: false }} />
            <Stack.Screen name="main-jp" options={{ headerShown: false }} />
            <Stack.Screen name="maintenance" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
          <Toast />
        </PaperProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
