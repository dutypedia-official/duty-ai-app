import { DarkScheme, LightScheme } from "@/constants/PaperColors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  useColorScheme,
  AppState,
  View,
  Platform,
  SafeAreaView,
} from "react-native";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import * as SystemUI from "expo-system-ui";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import { apiClient, isServerAvailable, MAIN_SERVER_URL } from "@/lib/api";
import useLang from "@/lib/hooks/useLang";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import useSocket from "@/lib/hooks/useSocket";
import useUi from "@/lib/hooks/useUi";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PostHogProvider } from "posthog-react-native";
import useMarket from "@/lib/hooks/useMarket";
import { NavigationContainer } from "@react-navigation/native";

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

const CURRENT_IOS_VERSION = 10;
const CURRENT_ANDROID_VERSION = 10;

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
    Courier: require("../assets/fonts/CourierPrime-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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
      tokenCache={tokenCache}>
      <NavigationContainer>
        <RootLayoutNav />
      </NavigationContainer>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const { selectMarket } = useMarket();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { setUpdateInfo, language } = useLang();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [update, setUpdate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const { socket } = useSocket();
  const { setRefreash, refreash, mainServerAvailable, setMainServerAvailable } =
    useUi();
  const { user } = useUser();

  const client = apiClient();

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
      if (socket) {
        socket.off(`new-noti`);
      }
    };
  }, [socket, user]);

  useEffect(() => {
    checkUpdate();
  }, []);

  useEffect(() => {
    if (isLoaded && !isLoading) {
      if (update?.update) {
        router.replace("/update");
      } else if (isSignedIn) {
        if (selectMarket === "Bangladesh") {
          router.replace("/main/home");
        } else {
          router.replace("/main-jp/home");
        }
      } else {
        if (selectMarket === "Bangladesh") {
          router.replace("/(start)");
        } else {
          router.replace("/(start-jp)");
        }
      }
    }
  }, [isLoaded, isLoading, update]);

  if (!isLoaded || isLoading) {
    return null;
  }

  return (
    <PostHogProvider
      apiKey="phc_s5HpI2azRTOp1wUjmfQR2ghMvWiFKtvtyRhVL8rVCpa"
      options={{
        host: "https://us.i.posthog.com",
      }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar backgroundColor={Colors[colorScheme ?? "dark"].background} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <PaperProvider theme={PaperTheme}>
              <Stack>
                <Stack.Screen name="(start)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(start-jp)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="main" options={{ headerShown: false }} />
                <Stack.Screen name="main-jp" options={{ headerShown: false }} />
                <Stack.Screen
                  name="update/index"
                  options={{ headerShown: false, title: "Update Available" }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </PaperProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        <Toast />
      </ThemeProvider>
    </PostHogProvider>
  );
}
