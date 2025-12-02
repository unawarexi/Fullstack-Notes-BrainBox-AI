import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  // Check if user has seen onboarding or is authenticated
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Replace with your actual logic (AsyncStorage, etc.)
  useEffect(() => {
    // Check if user has completed onboarding
    // Check if user is authenticated
  }, []);

  if (isFirstLaunch) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
