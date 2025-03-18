import { Redirect } from "expo-router";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const Index = () => {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  return <Redirect href={token ? "/(tabs)" : "/onboarding"} />;
};

export default Index;
