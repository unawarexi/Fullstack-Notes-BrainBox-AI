import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { Menu, Search, Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/image-strings";
import { router } from "expo-router";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const suggestions = ["Write your journal", "Are you confused? Write what's on your mind while I help arrange it", "Need to brainstorm ideas? Let's organize your thoughts", "Capture your daily reflections here", "Document your creative process with AI assistance"];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="pt-4 px-6">
        {/* Hamburger Menu */}
        <TouchableOpacity className="w-12 h-12 bg-white rounded-full border-[1px] border-gray-200 items-center justify-center mb-4 shadow-md">
          <Menu size={16} color="#000" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-1 shadow-md  mb-6 border-[1px] border-gray-200">
          <Search size={20} color="#999" />
          <TextInput className="flex-1 ml-3 text-base text-gray-900" placeholder="Search notes..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#999" />
        </View>
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
            <TouchableOpacity key={index} className="bg-gray-100 rounded-2xl px-5 py-4 mb-3 opacity-60" activeOpacity={0.7}>
              <Text className="text-gray-600 text-sm leading-5">{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-24 right-6">
        <TouchableOpacity onPress={() => router.push("/screens/notes-screen")} className="w-14 h-14 bg-gray-900 rounded-full items-center justify-center shadow-lg" activeOpacity={0.8}>
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
