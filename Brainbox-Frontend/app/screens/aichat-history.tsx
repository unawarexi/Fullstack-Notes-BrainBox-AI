import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Platform } from "react-native";
import Animated, { FadeIn, FadeOut, Layout, SlideInRight, SlideOutRight } from "react-native-reanimated";
import { Search, SlidersHorizontal, Edit3, Trash2, Save, Share2, Upload, Star } from "lucide-react-native";
import { router } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const chatData = [
	{
		section: "Today",
		items: [
			{ id: "1", text: "How Much Pushaps A day" },
			{ id: "2", text: "Top 10 Imdb Best Movies ever" },
			{ id: "3", text: "Tell me what support i played daily fitness" },
		],
	},
	{
		section: "Yesterday",
		items: [
			{ id: "4", text: "How Much Pushaps A day" },
			{ id: "5", text: "Top 10 Imdb Best Movies ever" },
			{ id: "6", text: "Tell me what support i played daily fitness" },
			{ id: "7", text: "Top 10 Imdb Best Movies ever" },
			{ id: "8", text: "Tell me what support i played daily fitness" },
		],
	},
];

const filterOptions = [
	{ label: "24 Hours", value: "24h" },
	{ label: "1 Week", value: "1w" },
	{ label: "1 Month", value: "1m" },
	{ label: "3 Months", value: "3m" },
	{ label: "6 Months", value: "6m" },
	{ label: "1 Year+", value: "1y+" },
];

export default function AiChatHistory() {
	const [selectedItems, setSelectedItems] = useState([]);
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [activeFilter, setActiveFilter] = useState("24h");
	const [showActions, setShowActions] = useState(false);

	const toggleItemSelection = (id: string) => {
		setSelectedItems((prev: any) => {
			const newSelection = prev.includes(id) ? prev.filter((item: any) => item !== id) : [...prev, id];
			setShowActions(newSelection.length > 0);
			return newSelection;
		});
	};

	const selectAll = () => {
		const allIds = chatData.flatMap((section) => section.items.map((item) => item.id));
		setSelectedItems(allIds);
		setShowActions(true);
	};

	const deselectAll = () => {
		setSelectedItems([]);
		setShowActions(false);
	};

	const handleAction = (action: any) => {
		console.log(`${action} action for items:`, selectedItems);
		// Implement action logic here
	};

	return (
		<View className="flex-1 bg-slate-50">
			{/* Header */}
			<View className="px-6 pt-14 pb-4">
				<View className="flex-row items-center justify-between mb-6">
					<Text className="text-4xl font-bold text-gray-900">History</Text>
					<TouchableOpacity onPress={() => router.back()} className="w-12 h-12 items-center justify-center">
						<Edit3 size={16} color="#000" strokeWidth={2} />
					</TouchableOpacity>
				</View>

				{/* Search and Filter */}
				<View className="flex-row items-center gap-3">
					<View className="flex-1 flex-row items-center bg-slate-100 rounded-2xl px-4 h-14 focus:border-2 focus:border-slate-200">
						<Search size={20} color="#9CA3AF" strokeWidth={2} />
						<TextInput placeholder="Search..." placeholderTextColor="#9CA3AF" className="flex-1 ml-3 text-base text-gray-900" />
					</View>
					<TouchableOpacity onPress={() => setShowFilterMenu(!showFilterMenu)} className="w-10 h-10 bg-black rounded-3xl items-center justify-center">
						<SlidersHorizontal size={20} color="#fff" strokeWidth={2} />
					</TouchableOpacity>
				</View>

				{/* Select All Option */}
				{selectedItems.length > 0 && (
					<Animated.View entering={FadeIn} exiting={FadeOut} className="mt-4 flex-row items-center justify-between">
						<Text className="text-sm text-gray-600">
							{selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
						</Text>
						<TouchableOpacity onPress={deselectAll}>
							<Text className="text-sm font-semibold text-blue-600">Deselect All</Text>
						</TouchableOpacity>
					</Animated.View>
				)}

				{selectedItems.length === 0 && (
					<Animated.View entering={FadeIn} exiting={FadeOut}>
						<TouchableOpacity onPress={selectAll} className="mt-4">
							<Text className="text-sm font-semibold text-blue-600">Select All</Text>
						</TouchableOpacity>
					</Animated.View>
				)}
			</View>

			{/* Chat History List */}
			<ScrollView className="flex-1 px-6">
				{chatData.map((section, sectionIndex) => (
					<Animated.View
						key={section.section}
						entering={FadeIn.duration(300).delay(120 * sectionIndex)}
						className="mb-6"
					>
						<Text className="text-2xl font-bold text-gray-900 mb-4">{section.section}</Text>
						{section.items.map((item, itemIndex) => {
							const isSelected = selectedItems.includes(item.id);
							return (
								<AnimatedPressable
									key={item.id}
									onPress={() => toggleItemSelection(item.id)}
									layout={Layout.springify()}
									entering={FadeIn.duration(300).delay(120 + itemIndex * 60)}
									className={`mb-3 p-4 rounded-2xl ${isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-slate-200"}`}
								>
									<Text className={`text-base ${isSelected ? "text-blue-900 font-medium" : "text-gray-500"}`}>{item.text}</Text>
								</AnimatedPressable>
							);
						})}
					</Animated.View>
				))}
			</ScrollView>

			{/* Filter Menu (dropdown with fade) - rendered after ScrollView so it overlays the list */}
			{showFilterMenu && (
				<Animated.View
					entering={FadeIn.duration(160)}
					exiting={FadeOut.duration(120)}
					style={{
						position: "absolute",
						right: 24,
						top: Platform.OS === "ios" ? 120 : 100,
						width: 160,
						zIndex: 9999,
						elevation: 20,
						backgroundColor: "#fff",
						borderRadius: 16,
						paddingVertical: 6,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 6 },
						shadowOpacity: 0.12,
						shadowRadius: 12,
					}}
				>
					{filterOptions.map((option) => (
						<TouchableOpacity
							key={option.value}
							onPress={() => {
								setActiveFilter(option.value);
								setShowFilterMenu(false);
							}}
							style={{
								paddingVertical: 10,
								paddingHorizontal: 12,
								backgroundColor: activeFilter === option.value ? "#F3F4F6" : "transparent",
								borderTopLeftRadius: 0,
								borderTopRightRadius: 0,
							}}
						>
							<Text style={{ fontSize: 14, color: activeFilter === option.value ? "#000" : "#374151", fontWeight: activeFilter === option.value ? "600" : "400" }}>
								{option.label}
							</Text>
						</TouchableOpacity>
					))}
				</Animated.View>
			)}

			{/* Action Bar */}
			{showActions && (
				<Animated.View
					entering={SlideInRight}
					exiting={SlideOutRight}
					className="absolute bottom-8 right-6 bg-black rounded-3xl shadow-lg"
					style={{
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 12,
						elevation: 8,
					}}
				>
					<View className="flex-row items-center p-3 gap-1">
						<TouchableOpacity onPress={() => handleAction("delete")} className="w-12 h-12 items-center justify-center">
							<Trash2 size={16} color="#fff" strokeWidth={2} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleAction("save")} className="w-12 h-12 items-center justify-center">
							<Save size={16} color="#fff" strokeWidth={2} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleAction("share")} className="w-12 h-12 items-center justify-center">
							<Share2 size={16} color="#fff" strokeWidth={2} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleAction("export")} className="w-12 h-12 items-center justify-center">
							<Upload size={16} color="#fff" strokeWidth={2} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleAction("bookmark")} className="w-12 h-12 items-center justify-center">
							<Star size={16} color="#fff" strokeWidth={2} />
						</TouchableOpacity>
					</View>
				</Animated.View>
			)}
		</View>
	);
}
