import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants/texts";
import { LinearGradient } from "expo-linear-gradient";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.6;

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleIndexChanged = (index: number) => {
    setActiveIndex(index);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className="flex-1 bg-[#E8EDF2]">
      {/* Swiper - Only for content that slides */}
      <View className="flex-1 mt-20">
        <Swiper ref={swiperRef} loop={false} showsPagination={false} onIndexChanged={handleIndexChanged} containerStyle={{ flex: 1 }}>
          {onboarding.map((item) => (
            <View key={item.id} className="flex-1">
              <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                {/* Full Image - 60% of screen */}
                <View
                  style={{
                    height: IMAGE_HEIGHT,
                    width: "100%",
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    resizeMode="cover"
                  />
                </View>
                {/* Pagination Dots - Modern style */}
                <View className="flex-row justify-center items-center">
                  {onboarding.map((_, index) => (
                    <Animated.View
                      key={index}
                      style={{
                        width: index === activeIndex ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: index === activeIndex ? "#1e293b" : "#cbd5e1",
                        marginHorizontal: 4,
                      }}
                    />
                  ))}
                </View>

                {/* Gradient Overlay - fades from bottom up */}
                <LinearGradient
                  colors={["transparent", "rgba(232,237,242,0.5)", "#E8EDF2"]}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: SCREEN_HEIGHT * 0.45,
                  }}
                  pointerEvents="none"
                />

                {/* Title & Description - Inside swipeable area */}
                <View className="flex-1 justify-start px-8 pt-12">
                  <View className="items-center">
                    <Text className="text-gray-900 text-2xl font-JakartaBold text-center mb-3 leading-snug">{item.title}</Text>

                    <Text className="text-gray-500 text-sm font-JakartaMedium text-center leading-relaxed">{item.description}</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          ))}
        </Swiper>
      </View>

      {/* Fixed Bottom Controls - Outside swiper, never moves */}
      <View className="absolute bottom-0 left-0 right-0 pb-10 px-8 bg-transparent">
        <View className="flex-row items-center gap-10">
          {/* Left Side - Empty spacer for balance */}
          <View className="w-20" />

          {/* Center - Navigation Buttons */}
          <View className="flex-row items-center" style={{ gap: 16 }}>
            {/* Back Button or Spacer */}
            {activeIndex > 0 ? (
              <TouchableOpacity
                onPress={() => swiperRef.current?.scrollBy(-1)}
                className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-gray-900 text-xl">←</Text>
              </TouchableOpacity>
            ) : (
              <View className="w-14" />
            )}

            {/* Next/Get Started Button */}
            <TouchableOpacity
              onPress={() => (isLastSlide ? router.replace("/(auth)/sign-up") : swiperRef.current?.scrollBy(1))}
              className="w-14 h-14 bg-gray-900 rounded-full items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              <Text className="text-white text-xl font-bold">{isLastSlide ? "✓" : "→"}</Text>
            </TouchableOpacity>
          </View>

          {/* Right Side - Skip Button */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-up")}
            className="pl-20"
            style={{
              elevation: 4,
            }}
          >
            <Text style={{ color: "#374151", fontSize: 16, fontFamily: "JakartaMedium" }}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
