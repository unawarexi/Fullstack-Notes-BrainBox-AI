import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import React, { useState } from "react";
import { ChevronLeft, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";
import InputField from "@/components/Input-Fields";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-white">
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
            <InputField
              icon={Mail}
              placeholder="JosephRen@Mail.Com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <InputField
              icon={Lock}
              placeholder="••••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showToggle
            />
          </View>

          {/* Forget Password */}
          <TouchableOpacity className="self-end mb-10">
            <Text className="text-gray-500 text-sm">Forget Password ?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={() => {
              router.dismissAll();
              router.replace("/(tabs)");
            }}
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
