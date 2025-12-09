import * as SecureStore from "expo-secure-store";

await SecureStore.setItemAsync("token", "abc123");
const token = await SecureStore.getItemAsync("token");

// Storage keys
// Save authentication tokens
// Get access token for API requests (with automatic refresh if needed)
// Get ID token for user verification
// Get refresh token for session management
// Check if token is expired
// Clear only auth tokens (keep user preferences)
// Check if user is authenticated
