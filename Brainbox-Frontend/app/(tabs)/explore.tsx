import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform } from "react-native";
import Animated, { useAnimatedStyle, withSpring, useSharedValue, interpolateColor } from "react-native-reanimated";
import { LucideIcons } from "@/constants/icons";

const { width } = Dimensions.get("window");

const tabs = [
  { id: "notes", label: "Notes", color: "#FFE5E5" },
  { id: "highlights", label: "Highlights", color: "#FFF4E5" },
  { id: "ai", label: "AI Suggestions", color: "#E5F4FF" },
  { id: "web", label: "Web References", color: "#F0E5FF" },
  { id: "people", label: "People You Might Need", color: "#FFE5F4" },
  { id: "schedules", label: "Schedules", color: "#FFFBE5" },
  { id: "contacts", label: "Contacts", color: "#E5FFFF" },
  { id: "favourites", label: "Favourites", color: "#FFE5E5" },
  { id: "others", label: "Others", color: "#F5F5F5" },
];

const notesSample = [
  {
    id: 1,
    title: "How To Draw A Professional Wireframe?",
    preview: "For Wireframe Design, You Need To Have A Pen And Paper With You, And Using These Two, You Can Design The Idea You Want On Paper For Web Or Mobile, Just Learn....",
    tags: ["Design", "Wireframe"],
    date: "2020/05/09",
    color: "#FFE5E5",
  },
  {
    id: 2,
    title: "Ways To Succeed Early",
    preview: "Start with clear goals and maintain consistent effort...",
    tags: ["Succeed", "Goals"],
    date: "2020/05/09",
    color: "#FFF4E5",
  },
  {
    id: 3,
    title: "Scientific Facts Of Space",
    preview: "The universe is vast and full of mysteries...",
    tags: ["Scientific", "Space"],
    date: "2020/05/09",
    color: "#E5FFE5",
  },
];

const ExploreScreen = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const scrollX = useSharedValue(0);
   const isIOS = Platform.OS === "ios";

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <View className="px-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-semibold">List Notes</Text>
              <Text className="text-sm text-gray-600">All Notes ⌄</Text>
            </View>
            {notesSample.map((note) => (
              <TouchableOpacity key={note.id} className="mb-3 p-4 rounded-2xl border border-gray-200" style={{ backgroundColor: note.color }}>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-base font-semibold flex-1 pr-2">{note.title}</Text>
                  {note.id === 1 && (
                    <View className="bg-orange-400 rounded-full w-8 h-8 items-center justify-center">
                      <LucideIcons.Fire size={12} color="#fff" />
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-600 mb-3">{note.preview}</Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-2">
                    {note.tags.map((tag, idx) => (
                      <View key={idx} className="bg-white px-3 py-1 rounded-full">
                        <Text className="text-xs text-gray-700">{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text className="text-xs text-gray-500">{note.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "highlights":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Your Highlights</Text>
            <View className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
              <Text className="text-sm text-gray-600">Important passages and quotes you&apos;ve saved will appear here.</Text>
            </View>
          </View>
        );

      case "ai":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">AI Suggestions</Text>
            <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200 mb-3">
              <Text className="text-sm font-medium mb-2">💡 Complete your wireframe guide</Text>
              <Text className="text-xs text-gray-600">Add sections on user testing and iteration</Text>
            </View>
            <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <Text className="text-sm font-medium mb-2">📚 Related topic: UX Design</Text>
              <Text className="text-xs text-gray-600">Explore more about user experience principles</Text>
            </View>
          </View>
        );

      case "web":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Web References</Text>
            <View className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <Text className="text-sm text-gray-600">Links and resources from your notes will be organized here.</Text>
            </View>
          </View>
        );

      case "people":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">People You Might Need</Text>
            <View className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
              <Text className="text-sm text-gray-600">Suggested connections based on your interests and notes.</Text>
            </View>
          </View>
        );

      case "schedules":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Schedules</Text>
            <View className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <Text className="text-sm text-gray-600">Your upcoming events and reminders will be displayed here.</Text>
            </View>
          </View>
        );

      case "contacts":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Contacts</Text>
            <View className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
              <Text className="text-sm text-gray-600">Manage your professional and personal contacts.</Text>
            </View>
          </View>
        );

      case "favourites":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Favourites</Text>
            <View className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <Text className="text-sm text-gray-600">Your starred and favorite items from across the app.</Text>
            </View>
          </View>
        );

      case "others":
        return (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">Others</Text>
            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <Text className="text-sm text-gray-600">Additional categories and miscellaneous items.</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* App Bar */}
      <View className={`px-4 py-4 flex-row justify-between items-center border-b border-gray-100 ${isIOS ? '' : 'pt-14'}`}>
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-black rounded-lg items-center justify-center">
            <LucideIcons.FileText size={18} color="#fff" />
          </View>
          <Text className="text-xl font-bold">Lao Note</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <LucideIcons.Search size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <LucideIcons.User size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Scrollable Tabs */}
      <View className="border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-4" contentContainerStyle={{ gap: 8 }}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-full ${isActive ? "bg-black" : "bg-gray-100"}`}>
                <Text className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16 }}>
        {renderContent()}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <LucideIcons.Plus size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExploreScreen;
