import * as SecureStore from "expo-secure-store";

// Storage keys
const KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  ID_TOKEN: "id_token",
  TOKEN_EXPIRY: "token_expiry",
  ONBOARDING_SEEN: "onboarding_seen",
} as const;

export const storageService = {
  // Save authentication tokens
  async saveAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
    console.log("[STORAGE] saveAuthTokens started");
    console.log("[STORAGE] Access token length:", accessToken?.length);
    console.log("[STORAGE] Refresh token length:", refreshToken?.length);
    
    try {
      console.log("[STORAGE] Decoding JWT to get expiry...");
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log("[STORAGE] JWT payload:", JSON.stringify(payload, null, 2));
      
      const expiry = payload.exp ? payload.exp * 1000 : Date.now() + 3600000;
      console.log("[STORAGE] Token expiry timestamp:", expiry);
      console.log("[STORAGE] Token expiry date:", new Date(expiry).toISOString());
      
      console.log("[STORAGE] Saving tokens to secure store...");
      await Promise.all([
        SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
        SecureStore.setItemAsync(KEYS.ID_TOKEN, accessToken),
        SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, expiry.toString())
      ]);
      console.log("[STORAGE] Tokens saved successfully");
    } catch (error) {
      console.error("[STORAGE] Error saving auth tokens:", error);
      throw error;
    }
  },

  // Get access token for API requests (with automatic refresh if needed)
  async getAccessToken(): Promise<string | null> {
    console.log("[STORAGE] getAccessToken started");
    try {
      const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
      console.log("[STORAGE] Token exists:", !!token);
      console.log("[STORAGE] Token length:", token?.length);

      if (!token) {
        console.log("[STORAGE] No token found");
        return null;
      }

      console.log("[STORAGE] Checking if token is expired...");
      const isExpired = await this.isTokenExpired();
      console.log("[STORAGE] Token expired:", isExpired);
      
      if (isExpired) {
        console.log("[STORAGE] Token is expired, returning null");
        return null;
      }
      
      console.log("[STORAGE] Returning valid token");
      return token;
    } catch (error) {
      console.error("[STORAGE] getAccessToken error:", error);
      return null;
    }
  },

  // Get ID token for user verification
  async getIdToken(): Promise<string | null> {
    console.log("[STORAGE] getIdToken started");
    try {
      const token = await SecureStore.getItemAsync(KEYS.ID_TOKEN);
      console.log("[STORAGE] ID token exists:", !!token);
      return token;
    } catch (error) {
      console.error("[STORAGE] getIdToken error:", error);
      return null;
    }
  },

  // Get refresh token for session management
  async getRefreshToken(): Promise<string | null> {
    console.log("[STORAGE] getRefreshToken started");
    try {
      const token = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
      console.log("[STORAGE] Refresh token exists:", !!token);
      return token;
    } catch (error) {
      console.error("[STORAGE] getRefreshToken error:", error);
      return null;
    }
  },

  // Check if token is expired
  async isTokenExpired(): Promise<boolean> {
    console.log("[STORAGE] isTokenExpired started");
    try {
      const expiry = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);
      console.log("[STORAGE] Expiry value:", expiry);
      
      if (!expiry) {
        console.log("[STORAGE] No expiry found, token is expired");
        return true;
      }
      
      const expiryTime = parseInt(expiry) - 300000; // 5 minute buffer
      const now = Date.now();
      const isExpired = now >= expiryTime;
      
      console.log("[STORAGE] Current time:", new Date(now).toISOString());
      console.log("[STORAGE] Expiry time (with buffer):", new Date(expiryTime).toISOString());
      console.log("[STORAGE] Token expired:", isExpired);
      
      return isExpired;
    } catch (error) {
      console.error("[STORAGE] isTokenExpired error:", error);
      return true;
    }
  },

  // Clear only auth tokens (keep user preferences)
  async clearAuthTokens(): Promise<void> {
    console.log("[STORAGE] clearAuthTokens started");
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(KEYS.ID_TOKEN),
        SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRY)
      ]);
      console.log("[STORAGE] Auth tokens cleared successfully");
    } catch (error) {
      console.error("[STORAGE] clearAuthTokens error:", error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    console.log("[STORAGE] isAuthenticated started");
    try {
      const token = await this.getAccessToken();
      const isAuth = token !== null && !(await this.isTokenExpired());
      console.log("[STORAGE] Is authenticated:", isAuth);
      return isAuth;
    } catch (error) {
      console.error("[STORAGE] isAuthenticated error:", error);
      return false;
    }
  },

  // Onboarding helpers
  async setHasSeenOnboarding(): Promise<void> {
    console.log("[STORAGE] setHasSeenOnboarding");
    await SecureStore.setItemAsync(KEYS.ONBOARDING_SEEN, "1");
  },

  async hasSeenOnboarding(): Promise<boolean> {
    console.log("[STORAGE] hasSeenOnboarding started");
    const v = await SecureStore.getItemAsync(KEYS.ONBOARDING_SEEN);
    console.log("[STORAGE] Has seen onboarding:", v === "1");
    return v === "1";
  },
};
