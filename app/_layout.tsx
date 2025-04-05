import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import AuthMiddleware from "./middleware";

import { useColorScheme } from "@/hooks/useColorScheme";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { SEND_EXPO_TOKEN_TO_BACKEND } from "@/services/notifications";
import { useAuthStore } from "@/store/authStore";

// Prevent splash from hiding automatically
SplashScreen.preventAutoHideAsync();

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Push Notification Setup Function (authToken passed as arg)
async function registerForPushNotificationsAsync(authToken: string) {
  let expoToken;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
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
      alert("Failed to get push token for push notification!");
      return;
    }

    expoToken = (await Notifications.getExpoPushTokenAsync()).data;

    console.log(expoToken);
    
    if (authToken) {
      await SEND_EXPO_TOKEN_TO_BACKEND(expoToken, authToken);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return expoToken;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const authToken = useAuthStore((state) => state.token);

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

  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Hide splash screen after fonts load
  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
    }
  }, [loaded]);

  // Register push notification only if authToken is present
  useEffect(() => {
    if (!authToken) return;

    registerForPushNotificationsAsync(authToken).then((token) => {
      if (token) {
        console.log("SETTING EXPO PUSH TOKEN");
        
        setExpoPushToken(token);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification Received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped notification:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [authToken]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthMiddleware>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </AuthMiddleware>
    </ThemeProvider>
  );
}
