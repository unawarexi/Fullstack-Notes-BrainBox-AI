import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { storageService } from "@/core/services/storage-service";
import { authService } from "@/core/auth/firebase-auth";
import { useUserBridge } from "../store/user-store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/core/config/firebase-config";

const Page = () => {
  const [initialized, setInitialized] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const userBridge = useUserBridge();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const seen = await storageService.hasSeenOnboarding();
        setIsFirstLaunch(!seen);

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            setIsAuthenticated(true);
            const verified = await authService.reloadAndCheckEmailVerified(firebaseUser);
            setIsVerified(verified);

            if (verified) {
              try {
                // Bridge handles setting user in store
                await userBridge.fetchCurrentUser();
              } catch (error) {
                console.error("Failed to fetch API user:", error);
              }
            }
          } else {
            setIsAuthenticated(false);
            setIsVerified(false);
          }

          setInitialized(true);
        });
      } catch (error) {
        console.error("Initialization error:", error);
        setInitialized(true);
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!initialized) return null;

  if (isFirstLaunch) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!isVerified) {
    return <Redirect href="/(auth)/verify-email" />;
  }

  return <Redirect href="/(tabs)" />;
};

export default Page;