import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { authService } from "@/core/auth/firebase-auth";

/**
 * Generate a cryptographically secure random nonce string.
 */
export const generateRandomNonce = (length = 32): string => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * SHA256 hash using expo-crypto, returns hex string.
 */
export const sha256 = async (value: string): Promise<string> => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
};


export const signInWithAppleFlow = async (
  checkEmailVerified: () => Promise<boolean>,
  replaceFn: (path: string) => void
): Promise<void> => {
  try {
    // Step 1: Generate a random nonce (unhashed)
    const rawNonce = generateRandomNonce();

    // Step 2: Hash the nonce to send to Apple
    const hashedNonce = await sha256(rawNonce);

    // Step 3: Request Apple Sign-In with the hashed nonce
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      nonce: hashedNonce, // Apple receives the HASHED nonce
    });

    const { identityToken } = credential;
    if (!identityToken) {
      throw new Error("Apple Sign-In failed: no identity token returned");
    }

    // Step 4: Sign in to Firebase with identityToken and RAW nonce
    // Firebase will hash rawNonce and verify it matches the nonce in identityToken
    await authService.signInWithApple(identityToken, rawNonce);

    // Step 5: Check email verification and route accordingly
    const verified = await checkEmailVerified();
    if (verified) {
      replaceFn("/(tabs)");
    } else {
      replaceFn("/(auth)/verify-email");
    }
  } catch (error) {
    // Log for debugging in development
    if (__DEV__) {
      console.error("Apple Sign-In Error:", error);
    }
    // Errors are expected to be surfaced by store/toast elsewhere
    throw error;
  }
};

export const signInWithGoogleFlow = async (
  signInWithGoogleFn: () => Promise<void>,
  checkEmailVerified: () => Promise<boolean>,
  replaceFn: (path: string) => void
): Promise<void> => {
  try {
    await signInWithGoogleFn();

    const verified = await checkEmailVerified();
    if (verified) {
      replaceFn("/(tabs)");
    } else {
      replaceFn("/(auth)/verify-email");
    }
  } catch (error) {
    // Log for debugging in development
    if (__DEV__) {
      console.error("Google Sign-In Error:", error);
    }
    // Errors shown by store toast
    throw error;
  }
};
