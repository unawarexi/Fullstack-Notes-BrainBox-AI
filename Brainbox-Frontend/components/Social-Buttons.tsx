import { Text, View, TouchableOpacity, Keyboard, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/user-store";

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
        router.replace("/(app)/home");
      } else {
        router.replace("/(auth)/verify-email");
      }
    } catch {
      // errors will be shown by store toast
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

        <TouchableOpacity style={[styles.btn, styles.facebook]}>
          <Text style={styles.facebookText}>FACEBOOK</Text>
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
  facebook: {
    backgroundColor: "#C5D7E8",
    marginLeft: 8,
  },
  googleText: {
    color: "#E85D5D",
    fontWeight: "700",
    letterSpacing: 2,
  },
  facebookText: {
    color: "#5D8FBD",
    fontWeight: "700",
    letterSpacing: 2,
  },
});

export default SocialButtons;
