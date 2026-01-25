import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, GoogleAuthProvider, OAuthProvider, signInWithCredential, User, UserCredential, updateProfile } from "firebase/auth";
import { auth } from "@/core/config/firebase-config";
import { storageService } from "../services/storage-service";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In (call this once in your app initialization)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // From Firebase Console
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<User> {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      await sendEmailVerification(userCred.user);
      await this.saveTokens(userCred);
      return userCred.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await this.saveTokens(userCred);
      return userCred.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  },

  async signInWithGoogle(): Promise<User> {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("Failed to get Google ID token");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCred = await signInWithCredential(auth, credential);
      await this.saveTokens(userCred);

      return userCred.user;
    } catch (error: any) {
      if (error.code === "SIGN_IN_CANCELLED" || error.code === "-5") {
        throw new Error("Google sign-in was cancelled");
      } else if (error.code === "IN_PROGRESS") {
        throw new Error("Google sign-in is already in progress");
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        throw new Error("Google Play Services not available");
      }
      throw new Error(error.message || "Google sign-in failed");
    }
  },

  async signInWithApple(identityToken: string, rawNonce?: string): Promise<User> {
    if (!identityToken) {
      throw new Error("Missing Apple identity token");
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: rawNonce,
    });

    const userCred = await signInWithCredential(auth, credential);
    await this.saveTokens(userCred);
    return userCred.user;
  },

  async logout(): Promise<void> {
    try {
      // Check if user is signed in via Firebase
      const user = auth.currentUser;
      const isSignedIn = !!user;

      // Sign out from Google if signed in
      if (isSignedIn) {
        try {
          await GoogleSignin.signOut();
        } catch (googleError) {
          // Ignore if no Google session exists
          if (__DEV__) {
            console.warn("Google signOut error (may be no active session):", googleError);
          }
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("Error during logout cleanup:", error);
      }
    }

    await storageService.clearAuthTokens();
    await signOut(auth);
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    await sendEmailVerification(user);
  },

  async saveTokens(userCred: UserCredential): Promise<void> {
    try {
      const token = await userCred.user.getIdToken();
      const refreshToken = userCred.user.refreshToken;

      if (!token || !refreshToken) {
        throw new Error("Failed to get tokens from user credential");
      }

      await storageService.saveAuthTokens(token, refreshToken);
    } catch (error) {
      console.error("Error saving tokens:", error);
      throw new Error("Failed to save authentication tokens");
    }
  },

  async refreshToken(): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const token = await user.getIdToken(true);
      const refreshToken = user.refreshToken;

      await storageService.saveAuthTokens(token, refreshToken);
      return token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh authentication token");
    }
  },

  async reloadAndCheckEmailVerified(passedUser?: User): Promise<boolean> {
    try {
      const user = passedUser || auth.currentUser;
      if (!user) return false;
      await user.reload();
      return !!user.emailVerified;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  async getCurrentToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting current token:", error);
      return null;
    }
  },

  getAuthErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already registered",
      "auth/invalid-email": "Invalid email address",
      "auth/operation-not-allowed": "Operation not allowed",
      "auth/weak-password": "Password is too weak",
      "auth/user-disabled": "This account has been disabled",
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-credential": "Invalid email or password",
      "auth/too-many-requests": "Too many attempts. Please try again later",
      "auth/network-request-failed": "Network error. Please check your connection",
    };
    return errorMessages[code] || "Authentication failed. Please try again";
  },
};
