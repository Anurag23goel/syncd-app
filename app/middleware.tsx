import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { ReactNode } from "react";

interface AuthMiddlewareProps {
  children: ReactNode;
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show nothing while checking authentication status
  if (isLoading || isAuthenticated === null) {
    return <Slot />;
  }

  // Get the segments from the current route
  const pathname = global.location?.pathname || "";
  const segments = pathname.split("/");

  // Check if the route is public (auth or onboarding)
  const isPublicRoute =
    segments.includes("(auth)") || segments.includes("onboarding");

  // Handle routing based on authentication state
  if (isPublicRoute && isAuthenticated) {
    return <Slot initialRouteName="(tabs)" />;
  }

  if (!isPublicRoute && !isAuthenticated) {
    return <Slot initialRouteName="(auth)" />;
  }

  // Render the default navigation
  return <>{children}</>;
}
