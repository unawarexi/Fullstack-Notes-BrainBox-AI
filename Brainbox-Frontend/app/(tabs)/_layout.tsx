import { Tabs } from "expo-router";
import React from "react";
import { LucideIcons } from "@/constants/icons";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: focused ? "#dbeafe" : "transparent",
                borderRadius: 25,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? "#2563eb" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LucideIcons.Home size={24} color={focused ? "#2563eb" : "#64748b"} strokeWidth={focused ? 2 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: focused ? "#dbeafe" : "transparent",
                borderRadius: 25,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? "#2563eb" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LucideIcons.Grid2x2 size={24} color={focused ? "#2563eb" : "#64748b"} strokeWidth={focused ? 2 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reminder"
        options={{
          title: "Reminders",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: focused ? "#dbeafe" : "transparent",
                borderRadius: 25,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? "#2563eb" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LucideIcons.History size={24} color={focused ? "#2563eb" : "#64748b"} strokeWidth={focused ? 2 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: focused ? "#dbeafe" : "transparent",
                borderRadius: 25,
                borderWidth: focused ? 1 : 0,
                borderColor: focused ? "#2563eb" : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LucideIcons.UserCircle size={24} color={focused ? "#2563eb" : "#64748b"} strokeWidth={focused ? 2 : 1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
