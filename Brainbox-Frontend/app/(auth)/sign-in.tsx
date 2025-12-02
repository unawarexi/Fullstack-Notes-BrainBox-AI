import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-white ">
      <View className="flex-1 rounded-3xl p-6 py-20">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mb-8 ">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-4xl font-bold text-gray-900 mb-8 mt-8">Login Your{"\n"}Account</Text>

        {/* Email Input */}
        <View className="mb-4">
          <View className="flex-row items-center rounded-2xl px-4 py-4 bg-slate-100 border-transparent focus:border-gray-900 focus:border-2 focus:bg-white ">
            <Mail size={22} color="#666" />
            <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="JosephRen@Mail.Com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-2">
          <View className="flex-row items-center rounded-2xl px-4 py-4 bg-slate-100  border-transparent focus:border-gray-900 focus:border-2 focus:bg-white ">
            <Lock size={22} color="#666" />
            <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="••••••••••" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}</TouchableOpacity>
          </View>
        </View>

        {/* Forget Password */}
        <TouchableOpacity className="self-end mb-10">
          <Text className="text-gray-500 text-sm">Forget Password ?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity className="bg-gray-900 rounded-2xl py-4 mb-10 border-4 ">
          <Text className="text-white text-center text-lg font-semibold">Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-400 text-sm">Create New Account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text className="text-gray-900 text-sm font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* fixed social buttons */}
      <SocialButtons />
    </View>
  );
};

export default SignIn;
