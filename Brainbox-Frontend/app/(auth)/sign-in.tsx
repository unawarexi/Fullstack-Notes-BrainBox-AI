import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import React from "react";
import { ChevronLeft, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";
import InputField from "@/components/Input-Fields";
import Toast from "@/components/ui/Toast-notifier";
import { useUserStore } from "@/store/user-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

const SignIn = () => {
  const signIn = useUserStore((s : any) => s.signIn);
  const checkEmailVerified = useUserStore((s: any) => s.checkEmailVerified);
  const toast = useUserStore((s: any) => s.toast);
  const clearToast = useUserStore((s: any) => s.clearToast);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = handleSubmit(async (data) => {
    try {
      await signIn(data.email.trim(), data.password);
      const verified = await checkEmailVerified();
      if (verified) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/verify-email");
      }
    } catch {
      // store shows toast
    }
  });

  return (
    <View className="flex-1 bg-white">
      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} duration={toast.duration} onHide={clearToast} />

      {/* Form area - will raise with keyboard, SocialButtons remain fixed below */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="rounded-3xl p-6 py-20">
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mb-8 ">
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-4xl font-bold text-gray-900 mb-8 mt-8">Login Your{"\n"}Account</Text>

          {/* Email Input */}
          <View className="mb-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  icon={Mail}
                  placeholder="JosephRen@Mail.Com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-2">{errors.email.message}</Text>}
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  icon={Lock}
                  placeholder="••••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  showToggle
                />
              )}
            />
            {errors.password && <Text className="text-red-500 text-sm mt-2">{errors.password.message}</Text>}
          </View>

          {/* Forget Password */}
          <TouchableOpacity onPress={() => router.push("/(auth)/reset-password")} className="self-end mb-10">
            <Text className="text-gray-500 text-sm">Forget Password ?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={onLogin}
            className="bg-gray-900 rounded-2xl py-4 mb-10 border-4 "
          >
            <Text className="text-white text-center text-lg font-semibold">Login</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-400 text-sm">Create New Account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-gray-900 text-sm font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* fixed social buttons (outside KeyboardAvoidingView so keyboard won't push it) */}
      <SocialButtons />
    </View>
  );
};

export default SignIn;
