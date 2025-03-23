import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import AuthMiddleware from "./middleware";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "SFPro-Black": require("../assets/fonts/SF-Pro-Display-Black.ttf"),
    "SFPro-Bold": require("../assets/fonts/SF-Pro-Display-Bold.ttf"),
    "SFPro-Heavy": require("../assets/fonts/SF-Pro-Display-Heavy.ttf"),
    "SFPro-Light": require("../assets/fonts/SF-Pro-Display-Light.ttf"),
    "SFPro-Medium": require("../assets/fonts/SF-Pro-Display-Medium.ttf"),
    "SFPro-Regular": require("../assets/fonts/SF-Pro-Display-Regular.ttf"),
    "SFPro-Semibold": require("../assets/fonts/SF-Pro-Display-Semibold.ttf"),
    "SFPro-Thin": require("../assets/fonts/SF-Pro-Display-Thin.ttf"),
    "SFPro-Ultralight": require("../assets/fonts/SF-Pro-Display-Ultralight.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

      <AuthMiddleware>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </AuthMiddleware>

  );
}
