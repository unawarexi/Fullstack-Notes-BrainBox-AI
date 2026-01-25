import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Undo2, Redo2, Check, Mic, Sparkles, Image as ImageIcon, Video, Music, FileText, Bold, Italic, List, Link, Layers, MoreHorizontal } from "lucide-react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import CustomBottomSheet from "@/components/Bottom-Sheet";
import BackButton from "@/components/Back-Button";
import { router } from "expo-router";

const NotesScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const isIos = Platform.OS === "ios";

  // refs & keyboard handling
  const scrollRef = useRef<ScrollView | null>(null);
  const contentRef = useRef<TextInput | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
      // scroll to bottom so the focused input is visible
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasChanges(true);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    console.log("Note saved:", { title, content });
  };

  const handleUndo = () => {
    console.log("Undo action");
  };

  const handleRedo = () => {
    console.log("Redo action");
  };

  const handleAIAssist = () => {
    console.log("AI Assist opened");
  };

  const mediaOptions = [
    { id: "image", icon: ImageIcon, label: "Image", color: "#000000" },
    { id: "video", icon: Video, label: "Video", color: "#000000" },
    { id: "audio", icon: Music, label: "Audio", color: "#000000" },
    { id: "document", icon: FileText, label: "Document", color: "#000000" },
  ];

  const formatOptions = [
    { id: "bold", icon: Bold, label: "Bold" },
    { id: "italic", icon: Italic, label: "Italic" },
    { id: "list", icon: List, label: "List" },
    { id: "link", icon: Link, label: "Link" },
  ];

  const otherOptions = [
    { id: "template", icon: Layers, label: "Template" },
    { id: "more", icon: MoreHorizontal, label: "More" },
  ];

  const handleOptionPress = (optionId: string) => {
    console.log(`${optionId} pressed`);
    setSheetVisible(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-slate-50">
      {/* App Bar */}
      <View className={`${Platform.OS === "ios" ? "pt-20" : "pt-14"} px-4 pb-4 border-b border-slate-200`}>
        <View className="flex-row items-center justify-between">
          {/* Left: Back Button and Title */}
          <View className="flex-row items-center flex-1">
            <BackButton onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-3" />
            <Text className="text-xl font-semibold text-gray-900">Notes</Text>
          </View>

          {/* Right: Action Buttons */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleUndo} activeOpacity={0.7}>
              <Undo2 size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleRedo} activeOpacity={0.7}>
              <Redo2 size={20} color="#666" />
            </TouchableOpacity>

            {/* Save Button - Only visible when there are changes */}
            {hasChanges && (
              <Animated.View entering={FadeIn.duration(200)}>
                <TouchableOpacity className="w-10 h-10 items-center justify-center bg-gray-900 rounded-full m-4" onPress={handleSave} activeOpacity={0.8}>
                  <Check size={20} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardHeight ? keyboardHeight + 140 : 140 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <View className="px-6 pt-6">
          <TextInput className="text-2xl font-bold text-gray-900 mb-4" placeholder="Title" placeholderTextColor="#999" value={title} onChangeText={handleTitleChange} maxLength={100} />
        </View>

        {/* Main Content Input */}
        <View className="flex-1 px-6">
          <TextInput
            ref={contentRef}
            className="text-base text-gray-800 leading-6"
            placeholder="Start writing your thoughts..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
            style={{ minHeight: 400 }}
            onFocus={() => {
              // ensure the input is visible when keyboard opens
              setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
            }}
            onContentSizeChange={() => {
              // scroll as content grows
              setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Toolbar */}
      <View className={`px-6 ${isIos ? 'py-2' : 'py-0'} border-t border-slate-200`}>
        <View className="flex-row items-center justify-between px-6 py-4">
          {/* Left Side: Mic and AI Assist */}
          <View className="flex-row items-center gap-3">
            {/* Voice Input Button */}
            <TouchableOpacity
              className="w-8 h-8 bg-gray-900 rounded-full items-center justify-center shadow-sm"
              activeOpacity={0.8}
              onPress={() => {
                Keyboard.dismiss();
                // existing voice action can go here
              }}
            >
              <Mic size={16} color="#fff" />
            </TouchableOpacity>

            {/* AI Assist Button */}
            <TouchableOpacity
              className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl flex-row items-center gap-2 border border-gray-200"
              onPress={() => {
                Keyboard.dismiss();
                handleAIAssist();
              }}
              activeOpacity={0.7}
            >
              <Sparkles size={14} color="#8B5CF6" />
              <Text className="text-sm font-medium text-gray-700">AI Assist</Text>
            </TouchableOpacity>
          </View>

          {/* Right Side: More Options Button */}
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center bg-gray-200 rounded-xl"
            activeOpacity={0.7}
            onPress={() => {
              Keyboard.dismiss();
              setSheetVisible(true);
            }}
          >
            <MoreHorizontal size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet for Options */}
      <CustomBottomSheet isVisible={sheetVisible} onClose={() => setSheetVisible(false)} snapPoints={Platform.OS === "ios" ? ["40%", "60%"] : ["45%", "65%"]} backdropOpacity={0.5} enablePanDownToClose scrollable>
        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-1">Insert</Text>
            <Text className="text-sm text-gray-500">Add media and format your note</Text>
          </View>

          {/* Media Section */}
          <View className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Media</Text>
            <View className="flex-row flex-wrap gap-3">
              {mediaOptions.map((option, index) => (
                <Animated.View key={option.id} entering={FadeInDown.delay(index * 50).duration(300)} className="flex-1 min-w-[45%]">
                  <TouchableOpacity onPress={() => handleOptionPress(option.id)} activeOpacity={0.7} className="bg-gray-50 rounded-2xl p-4 flex-row items-center gap-3 border border-gray-100">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${option.color}15` }}>
                      <option.icon size={20} color={option.color} />
                    </View>
                    <Text className="text-sm font-medium text-gray-900">{option.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Format Section */}
          <View className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Format</Text>
            <View className="flex-row flex-wrap gap-3">
              {formatOptions.map((option, index) => (
                <Animated.View key={option.id} entering={FadeInDown.delay((mediaOptions.length + index) * 50).duration(300)} className="flex-1 min-w-[45%]">
                  <TouchableOpacity onPress={() => handleOptionPress(option.id)} activeOpacity={0.7} className="bg-gray-50 rounded-2xl p-4 flex-row items-center gap-3 border border-gray-100">
                    <View className="w-10 h-10 bg-gray-200 rounded-xl items-center justify-center">
                      <option.icon size={20} color="#374151" />
                    </View>
                    <Text className="text-sm font-medium text-gray-900">{option.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Other Options Section */}
          <View className="mb-6">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools</Text>
            <View className="flex-row flex-wrap gap-3">
              {otherOptions.map((option, index) => (
                <Animated.View key={option.id} entering={FadeInDown.delay((mediaOptions.length + formatOptions.length + index) * 50).duration(300)} className="flex-1 min-w-[45%]">
                  <TouchableOpacity onPress={() => handleOptionPress(option.id)} activeOpacity={0.7} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 flex-row items-center gap-3 border border-purple-100">
                    <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center">
                      <option.icon size={20} color="#8B5CF6" />
                    </View>
                    <Text className="text-sm font-medium text-gray-900">{option.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      </CustomBottomSheet>
    </KeyboardAvoidingView>
  );
};

export default NotesScreen;
