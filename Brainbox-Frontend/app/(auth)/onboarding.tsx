import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Pressable, Image, Platform } from "react-native";
import React, { useState, useRef } from "react";
import Animated, { FadeInDown, FadeInUp, FadeIn, SlideInRight } from "react-native-reanimated";
import { Heart, MoreVertical, Scissors, Copy, ClipboardList, ShareIcon, Mic, ChevronLeft, ArrowRight } from "lucide-react-native";
import { images } from "@/constants/image-strings";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // platform adjustments to ensure layout fits on Android
  const isAndroid = Platform.OS === "android";
  const androidAdjust = {
    slidePaddingTop: isAndroid ? 44 : 60, // slightly reduced top padding on Android
    titleFontSize: isAndroid ? 60 : 72,
    titleLineHeight: isAndroid ? 68 : 80,
    noteCardMinHeight: isAndroid ? 140 : 160, // reduce note card height to avoid overflow
  };
  const noteCardStyleBase = { minHeight: androidAdjust.noteCardMinHeight };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < 2) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      // Navigate to main app
      router.replace("/(auth)/welcome");
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex - 1),
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Slide 1 - Black Background */}
        <View style={[styles.slide, { width, backgroundColor: "#141718" }]}>
          <View style={[styles.slideContent, { paddingTop: androidAdjust.slidePaddingTop }]}>
            {/* Header with dots menu */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.dotsMenu}>
                <MoreVertical color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Animated.Text
              entering={FadeInDown.delay(100)}
              style={[styles.titleWhite, { fontSize: androidAdjust.titleFontSize, lineHeight: androidAdjust.titleLineHeight }]}
            >
              My{"\n"}Notes
            </Animated.Text>

            {/* Filter Pills */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.filterContainer}>
              <View style={styles.filterPillActive}>
                <Text style={styles.filterTextActive}>All</Text>
                <Text style={styles.filterCount}>23</Text>
              </View>
              <View style={styles.filterPill}>
                <Text style={styles.filterText}>Important</Text>
              </View>
              <View style={styles.filterPill}>
                <Text style={styles.filterText}>To-do</Text>
              </View>
            </Animated.View>

            {/* Note Cards Grid */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.gridContainer}>
              {/* Row 1 */}
              <View style={styles.gridRow}>
                {/* Card 1 - Coral */}
                <View style={[styles.noteCard, noteCardStyleBase, { backgroundColor: "#f4a292" }]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Plan for{"\n"}The Day</Text>
                    <Heart color="#000" size={20} fill="transparent" />
                  </View>
                  <View style={styles.todoList}>
                    <View style={styles.todoItem}>
                      <View style={styles.checkboxChecked}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                      <Text style={styles.todoTextStrike}>Buy food</Text>
                    </View>
                    <View style={styles.todoItem}>
                      <View style={styles.checkbox} />
                      <Text style={styles.todoText}>GYM</Text>
                    </View>
                    <View style={styles.todoItem}>
                      <View style={styles.checkbox} />
                      <Text style={styles.todoText}>Invest</Text>
                    </View>
                  </View>
                </View>

                {/* Card 2 - Yellow */}
                <View style={[styles.noteCard, noteCardStyleBase, { backgroundColor: "#f4c542" }]}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Image{"\n"}Notes</Text>
                    <Heart color="#000" size={20} fill="transparent" />
                  </View>
                  <Text style={styles.updateText}>update 2hr ago</Text>
                  <View style={styles.imagePlaceholder}>
                    <Image source={images.girl} className="w-32 h-24 object-cover" />
                    {/* <Text style={styles.imagePlaceholderEmoji}>😊</Text> */}
                  </View>
                </View>
              </View>

              {/* Row 2 */}
              <View style={styles.gridRow}>
                {/* Card 3 - Cream */}
                <View style={[styles.noteCard, noteCardStyleBase, { backgroundColor: "#f5f1e3" }]}>
                  <View style={styles.cardHeaderSmall}>
                    <Text style={styles.emojiIcon}>😊</Text>
                    <Text style={styles.noteCount}>5 Notes</Text>
                    <Heart color="#000" size={18} fill="transparent" />
                  </View>
                  <Text style={styles.cardTitleSmall}>My Lectures</Text>
                </View>

                {/* Card 4 - Light Blue */}
                <View style={[styles.noteCard, noteCardStyleBase, { backgroundColor: "#b4c5e0" }]}>
                  <View style={styles.cardHeaderSmall}>
                    <Text style={styles.noteCount}>3 Notes</Text>
                    <Heart color="#000" size={18} fill="transparent" />
                  </View>
                  <Text style={styles.cardTitleSmall}>image{"\n"}Funny</Text>
                </View>
              </View>

              {/* Card 5 - Light Green */}
              <View style={[styles.noteCard, noteCardStyleBase, styles.noteCardWide, { backgroundColor: "#b8d8a5" }]}>
                <View style={styles.cardHeaderSmall}>
                  <View className="flex flex-row gap-x-4">
                    <Text style={styles.cardTitleSmall}>List of{"\n"}Something</Text>
                    <TouchableOpacity style={styles.fabMic}>
                      <Mic size={20} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <Heart color="#000" size={18} fill="transparent" />
                </View>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Slide 2 - Cream Background */}
        <View style={[styles.slide, { width, backgroundColor: "#f5f1e3" }]}>
          <View style={[styles.slideContent, { paddingTop: androidAdjust.slidePaddingTop }]}>
            {/* Header */}
            <View style={styles.headerCream}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sharedText}>Shared to</Text>
              <View style={styles.avatarGroup}>
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2025/11/19/11/09/rabbit-9965274_1280.jpg" }} style={[styles.avatar, styles.avatarImage]} />
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2025/12/01/07/46/autumn-9987500_1280.jpg" }} style={[styles.avatar, styles.avatarImage, styles.avatarRed]} />
              </View>
              <TouchableOpacity>
                <View style={styles.iconCircle}>
                  <ShareIcon color="#000" size={20} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Animated.Text entering={FadeInDown.delay(100)} style={styles.titleBlack}>
              Design{"\n"}Sprint{"\n"}Lecture
            </Animated.Text>

            {/* Description */}
            <Animated.Text entering={FadeInUp.delay(200)} style={styles.descriptionBlack}>
              Design Sprint is a way to quickly ideate, prototype, and validate a product idea in a week instead of waiting for months to lunch a full-fledged product
            </Animated.Text>

            {/* Tap to continue */}
            <View style={styles.tapHint}>
              <View style={styles.tapLine} />
              <Text style={styles.tapText}>Tap here to continue</Text>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Text>🎵</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Text>☰</Text>
              </TouchableOpacity>
            </View>

            {/* Design Sprint Phases */}
            <Text style={styles.phasesTitle}>Design Sprint Phases:</Text>
            <View style={styles.phasesContainer}>
              <View style={styles.phaseItem}>
                <Text style={styles.phaseText}>Empathize</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ------------------------------------Slide 3 - Cream & Black Split */}
        <View style={[styles.slide, { width, backgroundColor: "#f5f1e3" }]}>
          <View style={[styles.slideContent, { paddingTop: androidAdjust.slidePaddingTop }]}>
           {/* Header (Reminder about for slide 3) */}
           <View style={styles.headerCream}>
             <TouchableOpacity style={styles.backButton} onPress={goBack}>
               <ChevronLeft size={24} color="#000" />
             </TouchableOpacity>

              <Text style={styles.sharedText}>Reminder about</Text>
              <View style={styles.avatarGroup}>
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2024/08/23/14/25/ai-generated-8991952_1280.jpg" }} style={[styles.avatar, styles.avatarImage]} />
                <Image source={{ uri: "https://cdn.pixabay.com/photo/2022/01/07/19/06/executive-6922418_1280.jpg" }} style={[styles.avatar, styles.avatarImage, styles.avatarRed]} />
              </View>

              <TouchableOpacity>
                <Text style={styles.emailText}>...@gmail.com</Text>
                <Text style={styles.emailText}>...@business.org</Text>
              </TouchableOpacity>
            </View>

             {/* Title for Notes AI Brainbox */}
             <Animated.Text entering={FadeInDown.delay(100)} style={styles.titleBlack}>
               Notes AI{"\n"}Brainbox
             </Animated.Text>

            {/* New description/write-up for Notes AI Brainbox */}
            <Animated.Text entering={FadeInUp.delay(200)} style={styles.descriptionBlack}>
              Notes AI Brainbox summarizes, tags and organizes your notes automatically — extract action items, generate insights and search across ideas with AI-powered context.
            </Animated.Text>

            {/* Action Icons (keep cut, copy, paste) */}
            <View style={styles.actionIcons}>
              <View style={styles.iconCircle}>
                <Scissors color="#000" size={20} />
              </View>
              <View style={styles.iconCircle}>
                <Copy color="#000" size={20} />
              </View>
              <View style={styles.iconCircle}>
                <ClipboardList color="#000" size={20} />
              </View>
            </View>

            {/* Highlight / note example */}
            <View style={styles.highlightedBox}>
              <Text style={styles.highlightedText}>AI-generated highlights appear here — quick summaries, suggested tags, and follow-up tasks so you can focus on building.</Text>
            </View>

            {/* spacer so content sits above the FAB / Start button */}
            <View style={{ height: 20 }} />
          </View>
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
        ))}
      </View>

      {/* Global floating FAB row — Skip (left)  */}
      <View style={styles.globalFabContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.fabSkip}
          onPress={() => {
            router.replace("/(auth)/welcome");
          }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabForward} onPress={goToNext}>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    minHeight: height,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  // Slide 1 Styles
  header: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  dotsMenu: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleWhite: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    lineHeight: 80,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  filterPillActive: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    gap: 8,
  },
  filterPill: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterTextActive: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
  },
  filterCount: {
    color: "#666",
    fontSize: 14,
  },
  gridContainer: {
    flex: 1,
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  noteCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
  },
  noteCardWide: {
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardHeaderSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    lineHeight: 24,
  },
  cardTitleSmall: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    lineHeight: 22,
  },
  emojiIcon: {
    fontSize: 24,
  },
  noteCount: {
    fontSize: 12,
    color: "#666",
  },
  updateText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  todoList: {
    gap: 8,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
  },
  todoText: {
    fontSize: 16,
    color: "#000",
  },
  todoTextStrike: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "line-through",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderEmoji: {
    fontSize: 48,
  },
  fabContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  globalFabContainer: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  fabSkip: {
    height: 48,
    minWidth: 80,
    borderRadius: 30,
    paddingHorizontal: 18,
    backgroundColor: "#141718",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  skipButton: {
    height: 40,
    borderRadius: 30,
    paddingHorizontal: 18,
    backgroundColor: "#141718",
    justifyContent: "center",
    alignItems: "center",
  },
  skipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  centerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fabMic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  fabForward: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#141718",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
  },

  // Slide 2 Styles
  headerCream: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 32,
    color: "#000",
    fontWeight: "300",
  },
  sharedText: {
    fontSize: 14,
    color: "#666",
  },
  avatarGroup: {
    flexDirection: "row",
    marginLeft: -5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#999",
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "#f5f1e3",
  },
  avatarRed: {
    backgroundColor: "#ff4444",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#f5f1e3",
  },
  shareIcon: {
    fontSize: 24,
    marginLeft: "auto",
  },
  titleBlack: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
    lineHeight: 70,
  },
  descriptionBlack: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    marginBottom: 20,
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  tapLine: {
    height: 2,
    width: 40,
    backgroundColor: "#000",
  },
  tapText: {
    fontSize: 14,
    color: "#999",
  },
  bottomActions: {
    flexDirection: "row",
    marginTop: 30,
    gap: 15,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  phasesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 30,
    marginBottom: 15,
  },
  phasesContainer: {
    flexDirection: "row",
  },
  phaseItem: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  phaseText: {
    fontSize: 16,
    color: "#000",
  },

  // Slide 3 Styles
  blurredSection: {
    marginBottom: 20,
    opacity: 0.3,
  },
  blurredText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleFull: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    padding: 4,
  },
  iconEmoji: {
    fontSize: 20,
  },
  emailText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  highlightedBox: { backgroundColor: "#fef08a", padding: 20, borderRadius: 12, marginBottom: 20, position: "relative", borderColor: "#fef08a", borderWidth: 2, opacity: 0.9 },

  highlightedText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    fontWeight: "500",
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  keyboardSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 24,
    padding: 16,
    marginTop: "auto",
    marginBottom: 40,
  },
  keyboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  keyboardAa: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  keyboardControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  fontSize: {
    color: "#fff",
    fontSize: 14,
  },
  fontSizeBold: {
    fontSize: 24,
    fontWeight: "bold",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginBottom: 8,
  },
  keyboardRowBottom: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    width: 32,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  keyWide: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  // Pagination & Navigation
  pagination: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  paginationDot: {
    width: 12,
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  paginationDotActive: {
    width: 30,
    backgroundColor: "#000",
  },
});

export default Onboarding;
