import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { storageService } from "@/core/services/storage-service";
import { authService } from "@/core/auth/firebase-auth";
import { useUserStore, useUserBridge } from "../store/user-store";

export default function Index() {
  const [initialized, setInitialized] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const setUser = useUserStore((s) => s);
  const userBridge = useUserBridge(); // <-- bridge that uses react-query hooks

  useEffect(() => {
    (async () => {
      // Check onboarding flag
      const seen = await storageService.hasSeenOnboarding();
      setIsFirstLaunch(!seen);

      // Check auth token presence/expiry
      const signed = await storageService.isAuthenticated();
      setIsAuthenticated(signed);

      if (signed) {
        // reload and check firebase email verification
        const verified = await authService.reloadAndCheckEmailVerified();
        setIsVerified(verified);

        // fetch current user from API via the bridge
        try {
          await userBridge.fetchCurrentUser();
        } catch {
          // ignore
        }
      }

      setInitialized(true);
    })();
  }, []);

  if (!initialized) return null; // or a loading placeholder

  if (isFirstLaunch) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // authenticated but not verified -> verification screen
  if (!isVerified) {
    return <Redirect href="/(auth)/verify-email" />;
  }

  // signed & verified
  return <Redirect href="/(tabs)" />;
}
