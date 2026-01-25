import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from "react-native";
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolate } from "react-native-reanimated";
import { Plus, Trash2, Eye, Bookmark, Bell, Clock, ArrowRight, MoreVertical } from "lucide-react-native";
import BackButton from "@/components/Back-Button";

const ReminderHistoryScreen = () => {
  const [stats] = useState({
    recentlyDeleted: 12,
    recentlyViewed: 24,
    bookmarked: 8,
    upcomingReminders: 5,
  });

  const [todayReminders] = useState([
    { id: 1, number: "01", title: "Review quarterly report", subtitle: "Due by 3:00 PM", color: "#B4D4E1" },
    { id: 2, number: "02", title: "Team sync meeting", subtitle: "With marketing team", color: "#2D2D2D" },
    { id: 3, number: "03", title: "Update project docs", subtitle: "Architecture changes", color: "#FF9B7F" },
  ]);

  const CategoryCard = ({ icon: Icon, label, count, delay }) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)} className="bg-slate-100 rounded-2xl  p-3 flex-1 mx-1.5">
      <View className="flex-row items-center justify-between mb-3 ">
        <Text className="text-gray-600 text-sm font-medium">{label}</Text>
        <TouchableOpacity>
          <MoreVertical size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <Text className="text-3xl font-bold text-gray-900 mb-2">{count}</Text>
      <View className="bg-white rounded-full w-8 h-8 items-center justify-center">
        <Icon size={16} color="#6B7280" />
      </View>
    </Animated.View>
  );

  const ReminderCard = ({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(500)} className="mb-3">
      <TouchableOpacity className="rounded-2xl p-4 flex-row items-center" style={{ backgroundColor: item.color }} activeOpacity={0.7}>
        <View className="flex-1 flex-row items-center">
          <Text className="text-5xl font-bold mr-4" style={{ color: item.color === "#2D2D2D" ? "#FFF" : "#000" }}>
            {item.number}
          </Text>
          <View className="flex-1">
            <Text className="text-base font-semibold mb-1" style={{ color: item.color === "#2D2D2D" ? "#FFF" : "#000" }}>
              {item.title}
            </Text>
            <Text className="text-sm" style={{ color: item.color === "#2D2D2D" ? "#D1D5DB" : "#6B7280" }}>
              {item.subtitle}
            </Text>
          </View>
        </View>
        <ArrowRight size={24} color={item.color === "#2D2D2D" ? "#FFF" : "#000"} />
      </TouchableOpacity>
    </Animated.View>
  );

  const COLLAPSIBLE_HEIGHT = 140; // height reserved for the large date header
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const collapsibleStyle = useAnimatedStyle(() => {
    const t = Math.min(scrollY.value, COLLAPSIBLE_HEIGHT);
    const translateY = -t;
    const opacity = interpolate(scrollY.value, [0, COLLAPSIBLE_HEIGHT * 0.6], [1, 0], Extrapolate.CLAMP);
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Fixed App Bar (stays visible) */}
      <View className={`px-5 ${Platform.OS === "ios" ? "pt-20" : "pt-14"} pb-2`}>
        <View className="flex-row items-center justify-between mb-2">
          <BackButton />

          <TouchableOpacity className="bg-black rounded-full w-12 h-12 items-center justify-center" activeOpacity={0.8}>
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Use Animated.ScrollView to drive header collapse */}
      <Animated.ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} onScroll={scrollHandler} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 180 : 140 }}>
        {/* Reserve space and animate the large date block */}
        <View style={{ height: COLLAPSIBLE_HEIGHT, overflow: "hidden" }}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Animated.View style={[{ paddingBottom: 8 }, collapsibleStyle]}>
              <View className="mb-2">
                <Text className="text-6xl font-bold text-gray-900">06</Text>
                <Text className="text-lg text-gray-600 font-medium">February, 2023</Text>
                <Text className="text-base text-gray-500">Monday</Text>
              </View>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row mb-4 ">
          <CategoryCard icon={Trash2} label="Deleted" count={stats.recentlyDeleted} delay={100} />
          <CategoryCard icon={Eye} label="Viewed" count={stats.recentlyViewed} delay={200} />
        </View>

        <View className="flex-row mb-6">
          <CategoryCard icon={Bookmark} label="Bookmarked" count={stats.bookmarked} delay={300} />
          <CategoryCard icon={Bell} label="Reminders" count={stats.upcomingReminders} delay={400} />
        </View>

        {/* All Reminders Section */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="bg-gray-900 rounded-2xl p-4 flex-row items-center justify-between mb-6">
          <Text className="text-white text-base font-semibold">All Reminders</Text>
          <ArrowRight size={24} color="#FFF" />
        </Animated.View>

        {/* Today's Reminders */}
        <Animated.View entering={FadeInDown.delay(600).duration(500)} className="bg-slate-200 rounded-3xl p-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-xl font-bold text-gray-900">About Today</Text>
              <Text className="text-sm text-gray-500 mt-1">Your daily reminders are here</Text>
            </View>
            <TouchableOpacity>
              <MoreVertical size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {todayReminders.map((item, index) => (
            <ReminderCard key={item.id} item={item} index={index} />
          ))}
        </Animated.View>

        {/* Recently Contacted */}
        <Animated.View entering={FadeInDown.delay(700).duration(500)} className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-lg font-bold text-gray-900">Recently Contacted</Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-600">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-slate-100 rounded-2xl p-4">
            <View className="flex-row items-center">
              <Clock size={20} color="#6B7280" />
              <Text className="text-gray-600 ml-3 flex-1">No recent contacts</Text>
              <ArrowRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </Animated.View>

        {/* Bookmarked Sources */}
        <Animated.View entering={FadeInDown.delay(800).duration(500)} className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-lg font-bold text-gray-900">Bookmarked Sources</Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-600">View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-slate-200" activeOpacity={0.7}>
            <View className="flex-row items-center">
              <View className="bg-white rounded-full w-10 h-10 items-center justify-center">
                <Bookmark size={20} color="#6366F1" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-semibold">8 Saved Items</Text>
                <Text className="text-gray-600 text-sm">Tap to browse</Text>
              </View>
              <ArrowRight size={20} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default ReminderHistoryScreen;
