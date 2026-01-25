import { View, Text, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import React, { useState } from "react";
import { Menu } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/image-strings";
import { router } from "expo-router";
import SearchInput from "@/components/Search-Input";
import Fab from "@/components/Fab";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isIOS = Platform.OS === "ios";

  const suggestions = ["Write your journal", "Are you confused? Write what's on your mind while I help arrange it", "Need to brainstorm ideas? Let's organize your thoughts", "Capture your daily reflections here", "Document your creative process with AI assistance"];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="pt-4 px-6">
        {/* Hamburger Menu */}
        <TouchableOpacity className="w-12 h-12 bg-black rounded-full border-[1px] border-gray-200 items-center justify-center mb-4 shadow-md">
          <Menu size={16} color="#fff" />
        </TouchableOpacity>

        {/* Search Bar (moved to reusable component) */}
        <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Logo and Welcome Section */}
        <View className="items-center mb-8 opacity-40">
          {/* Brain Logo */}
          <View className="mb-6">
            <View className="w-32 h-32 items-center justify-center">
              {/* Logo representation - Three overlapping circles forming brain-like shape */}
              <View className="relative w-full h-full items-center justify-center">
                <Image source={images.logo} className="w-32 h-32" />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome to</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">BrainBox</Text>
          <Text className="text-sm text-gray-600 text-center px-8">
            Start journaling with AI assistance.{"\n"}
            Let&apos;s organize your thoughts together.
          </Text>
        </View>

        {/* Suggestions Section */}
        <View className="mt-4">
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} className="bg-slate-200 rounded-2xl px-5 py-4 mb-3 opacity-60" activeOpacity={0.7}>
              <Text className="text-gray-600 text-sm leading-5">{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button (moved to reusable component) */}
      <Fab onPress={() => router.push("/screens/notes-screen")} />
    </SafeAreaView>
  );
};

export default Index;
