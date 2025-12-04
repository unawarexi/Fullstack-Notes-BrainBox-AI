import { Text, View, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, Dimensions } from "react-native";
import React, { useState } from "react";
import { RotateCcw, PenSquare, ImageIcon, Newspaper, ArrowUp, Paperclip, History } from "lucide-react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { images } from "@/constants/image-strings";
import { router } from "expo-router";

const ChatScreen = () => {
    const [message, setMessage] = useState("");
    const isIOS = Platform.OS === "ios";    

  const recentConversations = ["Leaked Chat Sparks Gender Role Debate; it is truly alarming", "Harassment in Nigeria's Rave Scene", "Phyna's Deactivation: Grief or Vendetta?"];

  const actionButtons = [
    { icon: ImageIcon, label: "Create Images" },
    { icon: PenSquare, label: "Edit Image" },
    { icon: Newspaper, label: "Latest News" },
  ];

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const MAX_CONV_WIDTH = Math.round(SCREEN_WIDTH * 0.88); // cap conversation width to 88% of screen

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Bar - Matching exact design */}
      <View className={`flex-row items-center justify-between px-5 py-4 ${isIOS ? "mt-0" : "pt-14"}`}>
        <Image source={{ uri: "https://cdn.pixabay.com/photo/2024/08/23/14/25/ai-generated-8991952_1280.jpg" }} className="w-10 h-10 rounded-full" />

        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.push("/screens/aichat-history")}>
            <History size={isIOS ? 26 : 22} color="#757474" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity>
            <PenSquare size={isIOS ? 26 : 22} color="#757474" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Center Content - BrainBox and Image */}
        <View className="flex-1 items-center justify-center px-6 pb-20">
          <Animated.View entering={FadeIn.duration(600)} className="items-center">
            {/* BrainBox Text */}
            <Text className="text-5xl font-bold text-gray-400 mb-8 tracking-tight">BrainBox</Text>

            {/* Image Placeholder */}
            <View className="items-center justify-center">
              <Image source={images.logo} className="w-40 h-40 opacity-40" />
            </View>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <View className="px-4 pb-0">
          {/* Recent Conversations (smaller) */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-3">
              <RotateCcw size={18} color="#6B7280" strokeWidth={2} />
              <Text className="text-gray-500 text-sm font-medium">Recent Conversations</Text>
            </View>

            {recentConversations.map((conv, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={{
                  alignSelf: "flex-start", // shrink to content
                  backgroundColor: "#F1F5F9", // bg-gray-50
                  borderColor: "#CBD5E1",
                  borderWidth: 1,
                  borderRadius: 30,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 8,
                  opacity: 0.7,
                  maxWidth: MAX_CONV_WIDTH,
                }}
              >
                <Text style={{ color: "#374151", fontSize: 10, fontWeight: "600" }}>{conv}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons (smaller) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 10 }}>
            {actionButtons.map((btn, index) => (
              <TouchableOpacity key={index} className="bg-slate-100 border border-slate-300 rounded-2xl px-5 py-4 items-center justify-center" style={{ width: 120 }} activeOpacity={0.7}>
                <btn.icon size={24} color="#374151" strokeWidth={2} className="mb-2" />
                <Text className="text-gray-700 text-xs font-semibold text-center">{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* spacer so scroll content sits above the fixed input */}
          {/* <View style={{ height: 120 }} /> */}
        </View>

        {/* ScrollView end (previously opened earlier) */}
      </ScrollView>

      {/* Bottom Input Field — fixed and raised with keyboard */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
        <SafeAreaView className={`bg-slate-50 border-t border-slate-200 ${isIOS ? "mb-16" : "mb-20"}`}>
          <View className="px-4 pb-3 pt-2">
            <View className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1 flex-row items-center">
              <TouchableOpacity
                className="mr-2 py-2"
                onPress={() => {
                  Keyboard.dismiss();
                  // attach action
                }}
              >
                <Paperclip size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Ask anything"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-gray-900 text-base py-3.5"
                onFocus={() => {
                  /* ensure keyboardAvoiding lifts this view */
                }}
              />
              <TouchableOpacity
                className="bg-slate-300 rounded-full p-2 ml-2"
                onPress={() => {
                  Keyboard.dismiss();
                  // send action
                }}
              >
                <ArrowUp size={20} color="#fff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
