// Import the functions you need from the SDKs you need
// firebase.ts

import { initializeApp, getApps, getApp } from "@firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config (client-safe)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Ensure singleton app instance
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// React Native–correct Auth initialization with singleton pattern
function getAuthInstance() {
  try {
    // Try to get existing auth instance first
    return getAuth(app);
  } catch (error) {
    // If no auth instance exists, initialize with persistence
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
}

export const auth = getAuthInstance();





