import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, Image, SafeAreaView, Platform } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { User, Users, Bell, Lock, CreditCard, EyeOff, Search, Check, Link2, Plus, ChevronRight } from "lucide-react-native";
import { LucideIcons } from "@/constants/icons";
import BackButton from "@/components/Back-Button";

const ProfileScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
   const isIOS = Platform.OS === "ios";

  const socialProfiles = [
    { id: 1, name: "Facebook", icon: LucideIcons.User, connected: true },
    { id: 2, name: "Twitter", icon: LucideIcons.MessageCircle, connected: false },
    { id: 3, name: "Google", icon: LucideIcons.Search, connected: false },
  ];

  const connectedApps = [{ id: 1, name: "Dropbox", icon: LucideIcons.FileText, connected: true }];

  const accountSettings = [
    { id: 1, label: "Account information", icon: User },
    { id: 2, label: "Friends", icon: Users },
    { id: 3, label: "Notifications", icon: Bell },
  ];

  const privacySettings = [
    { id: 1, label: "Security", icon: Lock },
    { id: 2, label: "Login details", icon: User },
    { id: 3, label: "Billing", icon: CreditCard },
    { id: 4, label: "Privacy", icon: EyeOff },
  ];

  const SocialProfileCard = ({ item, index }) => {
    const IconComponent = item.icon;
    return (
      <Animated.View entering={FadeInRight.delay(index * 100).duration(500)} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center">
        <View className="w-12 h-12 bg-slate-100 rounded-full items-center justify-center">
          <IconComponent size={20} color="#6B7280" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-gray-900 font-medium text-base">{item.name}</Text>
          <Text className={`text-sm font-semibold ${item.connected ? "text-gray-900" : "text-gray-500"}`}>{item.connected ? "Connected" : "Not connected"}</Text>
        </View>
        <TouchableOpacity className={`w-12 h-12 rounded-full items-center justify-center ${item.connected ? "bg-purple-50" : "bg-black"}`} activeOpacity={0.7}>
          {item.connected ? <Check size={20} color="#8B5CF6" /> : <Link2 size={20} color="#FFF" />}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const AppCard = ({ item, index }) => {
    const IconComponent = item.icon;
    return (
      <Animated.View entering={FadeInRight.delay(index * 100).duration(500)} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center">
        <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
          <IconComponent size={20} color="#6B7280" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-gray-900 font-medium text-base">{item.name}</Text>
          <Text className="text-sm font-semibold text-gray-900">Connected</Text>
        </View>
        <View className="w-12 h-12 bg-purple-50 rounded-full items-center justify-center">
          <Check size={20} color="#8B5CF6" />
        </View>
      </Animated.View>
    );
  };

  const SettingsItem = ({ item, index }) => {
    const IconComponent = item.icon;
    return (
      <Animated.View entering={FadeInRight.delay(index * 50).duration(500)}>
        <TouchableOpacity className="flex-row items-center py-4 border-t border-gray-50 border-dotted" activeOpacity={0.7}>
          <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
            <IconComponent size={20} color="#000" />
          </View>
          <Text className="flex-1 ml-4 text-gray-900 font-medium text-base">{item.label}</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 180 : 140 }}>
        {/* Left Section - Apps & Connections */}
        <View className={`bg-slate-50 ${isIOS ? "pt-2" : "pt-14"} px-6 pb-6`}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(500)} className="flex-row items-center justify-between mb-6">
            <BackButton />

            <View className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <User size={24} color="#6B7280" />
              </View>
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-6">
            <Text className="text-4xl font-bold text-gray-900">Apps</Text>
            <Text className="text-gray-500 text-base mt-1">Connected apps and services</Text>
          </Animated.View>

          {/* Social Profiles Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mb-6 ">
            <View className="bg-gray-200 rounded-2xl p-5 mb-4">
              <Text className="text-xl font-bold text-gray-900 mb-4">Social profiles</Text>
              {socialProfiles.map((item, index) => (
                <SocialProfileCard key={item.id} item={item} index={index} />
              ))}
              <TouchableOpacity className="flex-row items-center mt-2" activeOpacity={0.7}>
                <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                  <Plus size={16} color="#FFF" />
                </View>
                <Text className="ml-3 text-gray-900 font-semibold text-base">Add More</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Apps Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <View className="bg-gray-200  rounded-2xl p-5">
              <Text className="text-xl font-bold text-gray-900 mb-4">Apps</Text>
              {connectedApps.map((item, index) => (
                <AppCard key={item.id} item={item} index={index} />
              ))}
              <TouchableOpacity className="flex-row items-center mt-2" activeOpacity={0.7}>
                <View className="w-8 h-8 bg-black rounded-full items-center justify-center">
                  <Plus size={16} color="#FFF" />
                </View>
                <Text className="ml-3 text-gray-900 font-semibold text-base">Add More</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Right Section - Settings */}
        <View className="bg-slate-50 p-6">
          {/* Settings Header */}
          <Animated.View entering={FadeInDown.duration(500)} className="flex-row items-center mb-6">
            <BackButton />
            <Text className="text-2xl font-bold text-gray-900 ml-4">Settings</Text>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-6">
            <View className={`bg-slate-50 border-[1px] border-slate-300 rounded-2xl px-4 ${isIOS ? "py-4 " : "py-1"} flex-row items-center focus:border-gray-300 focus:border-2 focus:bg-white`}>
              <Search size={20} color="#9CA3AF" />
              <TextInput className="flex-1 ml-3 text-gray-900 text-base" placeholder="Type to search" placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery} />
            </View>
          </Animated.View>

          {/* Account Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">Account</Text>
            <Text className="text-gray-500 text-sm mb-4">Update your info to keep your account</Text>
            <View className="bg-gray-200 rounded-2xl px-5 py-2">
              {accountSettings.map((item, index) => (
                <SettingsItem key={item.id} item={item} index={index} />
              ))}
            </View>
          </Animated.View>

          {/* Privacy Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Privacy</Text>
            <Text className="text-gray-500 text-sm mb-4">Customize your privacy to make experience better</Text>
            <View className="bg-gray-200  rounded-2xl px-5 py-2">
              {privacySettings.map((item, index) => (
                <SettingsItem key={item.id} item={item} index={index} />
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
