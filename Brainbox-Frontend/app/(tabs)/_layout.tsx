import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { LucideIcons } from "@/constants/icons";
import { Platform, View, Animated, StyleSheet, Easing } from "react-native";

export default function TabLayout() {
  // Animated Tab icon component
  const TabIcon = ({ Icon, focused }: { Icon: any; focused: boolean }) => {
    const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(progress, {
        toValue: focused ? 1 : 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [focused, progress]);

    const bgScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.02] });
    const bgOpacity = progress;
    const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
    const dotTranslateY = progress.interpolate({ inputRange: [0, 1], outputRange: [6, 0] });

    return (
      <View style={styles.iconWrapper}>
        {/* Animated dark background circle (gray-900) */}
        <Animated.View
          style={[
            styles.bgCircle,
            {
              opacity: bgOpacity,
              transform: [{ scale: bgScale }],
            },
          ]}
        />
        {/* Icon (scales lightly when active) */}
        <Animated.View style={{ transform: [{ scale: iconScale }], zIndex: 2 }}>
          <Icon size={20} color={focused ? "#ffffff" : "#64748b"} strokeWidth={focused ? 2 : 1.5} />
        </Animated.View>

        {/* small fullstop dot under active icon */}
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: bgOpacity,
              transform: [{ translateY: dotTranslateY }],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 2,
          backgroundColor: "#F8FAFC",
          borderTopColor: "#e2e8f0",
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 10,
          paddingHorizontal: 20,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#64748b",
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ focused }) => <TabIcon Icon={LucideIcons.Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => <TabIcon Icon={LucideIcons.Grid2x2} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Brainy",
          tabBarIcon: ({ focused }) => <TabIcon Icon={LucideIcons.Brain} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reminder"
        options={{
          title: "Reminders",
          tabBarIcon: ({ focused }) => <TabIcon Icon={LucideIcons.History} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon Icon={LucideIcons.UserCircle} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bgCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827", // gray-900
    // subtle border to define shape on light backgrounds
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.06)",
  },
  dot: {
    position: "absolute",
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#111827", // small fullstop dot (gray-900)
    // small white border so dot reads on dark nav backgrounds
    borderWidth: 1,
    borderColor: "#ffffff",
  },
});
