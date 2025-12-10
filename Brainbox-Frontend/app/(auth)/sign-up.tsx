import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import React from "react";
import { ChevronLeft, User, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";
import InputField from "@/components/Input-Fields";
import Toast from "@/components/ui/Toast-notifier";
import { useUserStore } from "@/store/user-store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*\d)/, "Password must contain at least one number"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const signUp = useUserStore((s) => s.signUp);
  const toast = useUserStore((s) => s.toast);
  const clearToast = useUserStore((s) => s.clearToast);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onRegister = handleSubmit(async (data) => {
    try {
      await signUp(data.name.trim(), data.email.trim(), data.password);
      router.replace("/(auth)/verify-email");
    } catch {
      // store shows toast
    }
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} duration={toast.duration} onHide={clearToast} />

      {/* Form area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-6 py-20">
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mb-8">
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-4xl font-bold text-gray-900 mb-8">Create your{"\n"}Account</Text>

          {/* Name Input */}
          <View className="mb-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField icon={User} placeholder="Joseph Ren" value={value} onChangeText={onChange} onBlur={onBlur} autoCapitalize="words" />
              )}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-2">{errors.name.message}</Text>}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField icon={Mail} placeholder="JosephRen@Mail.Com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" autoCapitalize="none" />
              )}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-2">{errors.email.message}</Text>}
          </View>

          {/* Password Input */}
          <View className="mb-10">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField icon={Lock} placeholder="••••••••••" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry showToggle />
              )}
            />
            {errors.password && <Text className="text-red-500 text-sm mt-2">{errors.password.message}</Text>}
          </View>

          {/* Register Button */}
          <TouchableOpacity onPress={onRegister} className="bg-gray-900 rounded-2xl py-4 mb-10">
            <Text className="text-white text-center text-lg font-semibold">Register</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-400 text-sm">Already Have An Account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-gray-900 text-sm font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* fixed social buttons */}
      <SocialButtons />
    </View>
  );
};

export default SignUp;
