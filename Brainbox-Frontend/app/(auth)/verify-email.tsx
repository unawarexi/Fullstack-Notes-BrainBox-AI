import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "@/store/user-store";
import Toast from "@/components/ui/Toast-notifier";
import { useRouter } from "expo-router";
import { authService } from "@/core/auth/firebase-auth";
import LottieView from "lottie-react-native";
import { images } from "@/constants/image-strings";

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const toast = useUserStore((s) => s.toast);
  const clearToast = useUserStore((s) => s.clearToast);
  const checkEmailVerified = useUserStore((s) => s.checkEmailVerified);
  const setToast = useUserStore((s) => s.setToast);
  const router = useRouter();

  const onCheck = async () => {
    setIsChecking(true);
    try {
      const verified = await checkEmailVerified();
      if (verified) {
        setToast("Email verified successfully!", "success");
        router.replace("/(tabs)");
      } else {
        setToast("Email not verified yet. Please check your inbox.", "info");
      }
    } catch (err: any) {
      setToast(err?.message || "Failed to check verification", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const onResend = async () => {
    setIsResending(true);
    try {
      await authService.resendVerificationEmail();
      setToast("Verification email resent successfully!", "success");
    } catch (err: any) {
      setToast(err?.message || "Failed to resend verification email", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} duration={toast.duration} onHide={clearToast} />

      <View className="items-center">
        {/* Placeholder for GIF/Animation */}
        <View className="w-72 h-72 items-center justify-center mb-8">
          {/* Replace this View with your GIF Image */}
          {/* Alternative: Use a placeholder icon if no GIF yet */}
          <View className="w-24 h-24  rounded-full items-center justify-center">
            <LottieView source={images.email} autoPlay loop={true} resizeMode="contain" style={{ width: 250, height: 300 }} />
          </View>
        </View>

        {/* Heading */}
        <Text className="text-3xl font-bold text-gray-900 text-center mb-3">Verify Your Email</Text>

        {/* Subtitle */}
        <Text className="text-center text-gray-600 text-base mb-8 px-4">We&apos;ve sent a verification link to your email. Please check your inbox and verify to continue.</Text>

        {/* Check Verification Button */}
        <TouchableOpacity onPress={onCheck} disabled={isChecking} className={`py-4 rounded-full items-center w-full mb-4 ${isChecking ? "bg-gray-400" : "bg-gray-900"}`} activeOpacity={0.8}>
          <Text className="text-white text-lg font-semibold">{isChecking ? "Checking..." : "I've Verified — Continue"}</Text>
        </TouchableOpacity>

        {/* Resend Email Button */}
        <TouchableOpacity onPress={onResend} disabled={isResending} className={`py-4 rounded-full items-center w-full ${isResending ? "bg-gray-100" : "bg-gray-200"}`} activeOpacity={0.8}>
          <Text className="text-gray-700 text-lg font-semibold">{isResending ? "Sending..." : "Resend Verification Email"}</Text>
        </TouchableOpacity>

        {/* Helper Text */}
        <Text className="text-center text-gray-500 text-sm mt-6">Didn&apos;t receive the email? Check your spam folder or try resending.</Text>
      </View>
    </View>
  );
};

export default VerifyEmail;
