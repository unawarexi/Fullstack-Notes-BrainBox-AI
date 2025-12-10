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
    const expiry = Date.now() + 3600000; // 1 hour from now
    await Promise.all([SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken), SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken), SecureStore.setItemAsync(KEYS.ID_TOKEN, accessToken), SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, expiry.toString())]);
  },

  // Get access token for API requests (with automatic refresh if needed)
  async getAccessToken(): Promise<string | null> {
    const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    if (!token) return null;

    const isExpired = await this.isTokenExpired();
    if (isExpired) {
      // Token refresh should be handled by auth service
      return null;
    }
    return token;
  },

  // Get ID token for user verification
  async getIdToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(KEYS.ID_TOKEN);
  },

  // Get refresh token for session management
  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  // Check if token is expired
  async isTokenExpired(): Promise<boolean> {
    const expiry = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);
    if (!expiry) return true;
    return Date.now() >= parseInt(expiry);
  },

  // Clear only auth tokens (keep user preferences)
  async clearAuthTokens(): Promise<void> {
    await Promise.all([SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN), SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN), SecureStore.deleteItemAsync(KEYS.ID_TOKEN), SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRY)]);
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null && !(await this.isTokenExpired());
  },

  // Onboarding helpers
  async setHasSeenOnboarding(): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ONBOARDING_SEEN, "1");
  },

  async hasSeenOnboarding(): Promise<boolean> {
    const v = await SecureStore.getItemAsync(KEYS.ONBOARDING_SEEN);
    return v === "1";
  },
};
