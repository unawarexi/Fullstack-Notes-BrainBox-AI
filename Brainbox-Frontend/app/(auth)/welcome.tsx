import { Text, View, TouchableOpacity, Image} from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { images } from "@/constants/image-strings";
import { useRouter } from "expo-router";

const Welcome = () => {
    const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        <View className="">
          {/* Logo */}
          <View className="items-center mb-8 py-10">
            <View className=" items-center justify-center mb-6">
        
              <Image source={images.logo} className="w-48 h-48" />
            </View>

            <Text className="text-4xl font-bold text-gray-900 text-cente mb-4">Welcome to</Text>
            <Text className="text-4xl font-bold text-gray-900 text-center">BrainBox</Text>
          </View>

          {/* Buttons */}
          <View className="py-4 gap-6">
            {/* Log in Button */}
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              className="bg-gray-900 py-4 rounded-full items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-white text-lg font-semibold">Log in</Text>
            </TouchableOpacity>

            {/* Sign up Button */}
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")} className="bg-gray-200 py-4 rounded-full items-center">
              <Text className="text-gray-500 text-lg font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View className="mt-8">
            <Text className="text-gray-400 text-center mb-4 text-sm">Continue With Accounts</Text>

            <View className="flex-row justify-center" style={{ gap: 16 }}>
              {/* Google Button */}
              <TouchableOpacity className="bg-red-100 py-3 px-8 rounded-full flex-row items-center" style={{ gap: 8 }}>
                <Text className="text-red-500 text-base font-semibold">GOOGLE</Text>
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity className="bg-blue-100 py-3 px-8 rounded-full flex-row items-center" style={{ gap: 8 }}>
                <Text className="text-blue-500 text-base font-semibold">FACEBOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
