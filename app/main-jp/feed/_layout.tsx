import { SplashScreen, Stack, useRouter } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Feed", headerShown: false }}
      />
      <Stack.Screen name="view" options={{ title: "Back" }} />
    </Stack>
  );
}
