import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import React, { useState } from "react";
import { ChevronLeft, User, Mail, Lock } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";
import InputField from "@/components/Input-Fields";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-gray-50">
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
            <InputField icon={User} placeholder="Joseph Ren" value={name} onChangeText={setName} autoCapitalize="words" />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <InputField icon={Mail} placeholder="Joseph Ren@Mail.Com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          {/* Password Input */}
          <View className="mb-10">
            <InputField icon={Lock} placeholder="••••••••••" value={password} onChangeText={setPassword} secureTextEntry showToggle />
          </View>

          {/* Register Button */}
          <TouchableOpacity className="bg-gray-900 rounded-2xl py-4 mb-10">
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
