import { Text, View, TouchableOpacity, Keyboard, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/user-store";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { authService } from "@/core/auth/firebase-auth";

const SocialButtons = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const signInWithGoogle = useUserStore((s) => s.signInWithGoogle);
  const checkEmailVerified = useUserStore((s) => s.checkEmailVerified);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // When keyboard is visible on Android, move the component down (negative bottom)
  const bottomOffset = Platform.OS === "android" && keyboardVisible ? -keyboardHeight : 20;

  const onGooglePress = async () => {
    try {
      await signInWithGoogle();
      const verified = await checkEmailVerified();
      if (verified) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/verify-email");
      }
    } catch {
      // errors will be shown by store toast
    }
  };

  // helper: generate a random nonce
  const generateRandomNonce = (length = 32) => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  // helper: sha256 hash using expo-crypto
  const sha256 = async (value: string) => {
    // CryptoDigestAlgorithm enum is available on expo-crypto
    // returns hex string
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);
  };

  // Apple sign-in handler: uses expo-apple-authentication to get identityToken,
  // sends identityToken + rawNonce to authService.signInWithApple
  const onApplePress = async () => {
    try {
      // Generate raw nonce and hashed nonce for Apple -> Firebase flow
      const rawNonce = generateRandomNonce();
      const hashedNonce = await sha256(rawNonce);

      // Request Apple credential with hashed nonce
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
        nonce: hashedNonce,
      });

      const identityToken = credential.identityToken;
      if (!identityToken) throw new Error("Apple Sign-In failed: no identity token returned");

      // Use firebase authService to complete sign-in with identityToken + rawNonce
      await authService.signInWithApple(identityToken, rawNonce);

      const verified = await checkEmailVerified();
      if (verified) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/verify-email");
      }
    } catch {
      // errors will be shown by store toast or can be handled here if desired
    }
  };

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.divider} />
      <Text style={styles.hint}>Continue With Accounts</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.google]} onPress={onGooglePress}>
          <Text style={styles.googleText}>GOOGLE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.apple]} onPress={onApplePress}>
          <Text style={styles.appleText}>APPLE ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    // default bottom applied dynamically
    paddingHorizontal: 24,
    paddingBottom: 18,
    alignItems: "center",
    // ensure it's on top of most content but still can be behind the keyboard when moved
    zIndex: 1000,
    elevation: 10,
  },
  divider: {
    alignSelf: "stretch",
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 20,
  },
  hint: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  google: {
    backgroundColor: "#F5C5C5",
    marginRight: 8,
  },
  apple: {
    backgroundColor: "#F0F0F0",
    marginLeft: 8,
  },
  googleText: {
    color: "#E85D5D",
    fontWeight: "700",
    letterSpacing: 2,
  },
  appleText: {
    color: "#111111",
    fontWeight: "700",
    letterSpacing: 2,
  },
});

export default SocialButtons;
