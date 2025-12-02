import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { router } from "expo-router";
import SocialButtons from "../../components/Social-Buttons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 p-6 py-20">
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mb-8">
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-4xl font-bold text-gray-900 mb-8">Create your{"\n"}Account</Text>

        {/* Name Input */}
        <View className="mb-4">
          <View className="flex-row items-center rounded-2xl px-4 py-4 bg-slate-100 border-transparent focus:border-gray-900 focus:border-2 focus:bg-white ">
            <User size={22} color="#666" />
            <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="Joseph Ren" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <View className="flex-row items-center rounded-2xl px-4 py-4 bg-slate-100  border-transparent focus:border-gray-900 focus:border-2 focus:bg-white ">
            <Mail size={22} color="#666" />
            <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="Joseph Ren@Mail.Com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        </View>

        {/* Password Input */}
        <View className="mb-10">
          <View className="flex-row items-center rounded-2xl px-4 py-4 bg-slate-100  border-transparent focus:border-gray-900 focus:border-2 focus:bg-white ">
            <Lock size={22} color="#666" />
            <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="••••••••••" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>{showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}</TouchableOpacity>
          </View>
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
      </View>

      {/* fixed social buttons */}
      <SocialButtons />
    </View>
  );
};

export default SignUp;
