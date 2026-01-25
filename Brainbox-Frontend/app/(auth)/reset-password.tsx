import {Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/Input-Fields";
import Toast from "@/components/ui/Toast-notifier";
import { authService } from "@/core/auth/firebase-auth";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "expo-router";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useUserStore((s) => s.toast);
  const setToast = useUserStore((s) => s.setToast);
  const clearToast = useUserStore((s) => s.clearToast);
  const router = useRouter();

  const onReset = async () => {
    try {
      await authService.sendPasswordReset(email.trim());
      setToast("Password reset email sent", "info");
      router.back();
    } catch (err: any) {
      setToast(err?.message || "Failed to send reset", "error");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View className="flex-1 p-6 bg-white justify-center">
        <Toast visible={toast.visible} message={toast.message} type={toast.type} duration={toast.duration} onHide={clearToast} />

        <Text className="text-2xl font-bold mb-6">Reset Password</Text>
        <InputField placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TouchableOpacity onPress={onReset} className="bg-gray-900 rounded-2xl py-4 mt-6">
          <Text className="text-white text-center text-lg font-semibold">Send reset link</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

