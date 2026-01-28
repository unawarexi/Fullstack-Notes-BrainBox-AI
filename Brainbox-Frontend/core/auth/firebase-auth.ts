import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, GoogleAuthProvider, OAuthProvider, signInWithCredential, User, UserCredential, updateProfile } from "firebase/auth";
import { auth } from "@/core/config/firebase-config";
import { storageService } from "../services/storage-service";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In (call this once in your app initialization)
export const configureGoogleSignIn = () => {
  console.log("[AUTH] Configuring Google Sign-In...");
  
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
  
  console.log("[AUTH] Google Sign-In configured successfully");
};

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<User> {
    console.log("[AUTH] signUp started", { name, email });
    try {
      console.log("[AUTH] Creating user with email and password...");
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("[AUTH] User created:", userCred.user.uid);
      
      console.log("[AUTH] Updating user profile with name:", name);
      await updateProfile(userCred.user, { displayName: name });
      console.log("[AUTH] Profile updated successfully");
      
      console.log("[AUTH] Sending email verification...");
      await sendEmailVerification(userCred.user);
      console.log("[AUTH] Verification email sent");
      
      console.log("[AUTH] Saving tokens...");
      await this.saveTokens(userCred);
      console.log("[AUTH] Tokens saved successfully");
      
      console.log("[AUTH] signUp completed successfully");
      return userCred.user;
    } catch (error: any) {
      console.error("[AUTH] signUp error:", error);
      console.error("[AUTH] Error code:", error.code);
      console.error("[AUTH] Error message:", error.message);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    console.log("[AUTH] signIn started", { email });
    try {
      console.log("[AUTH] Signing in with email and password...");
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("[AUTH] Sign in successful:", userCred.user.uid);
      console.log("[AUTH] Email verified:", userCred.user.emailVerified);
      
      console.log("[AUTH] Saving tokens...");
      await this.saveTokens(userCred);
      console.log("[AUTH] Tokens saved successfully");
      
      console.log("[AUTH] signIn completed successfully");
      return userCred.user;
    } catch (error: any) {
      console.error("[AUTH] signIn error:", error);
      console.error("[AUTH] Error code:", error.code);
      console.error("[AUTH] Error message:", error.message);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  },

  async signInWithGoogle(): Promise<User> {
    console.log("[AUTH] signInWithGoogle started");
    try {
      console.log("[AUTH] Checking Play Services...");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log("[AUTH] Play Services available");
      
      console.log("[AUTH] Initiating Google Sign-In...");
      const userInfo = await GoogleSignin.signIn();
      console.log("[AUTH] Google Sign-In successful, user info received");
      console.log("[AUTH] User info:", JSON.stringify(userInfo, null, 2));
      
      const idToken = userInfo.data?.idToken;
      console.log("[AUTH] ID Token exists:", !!idToken);

      if (!idToken) {
        console.error("[AUTH] No ID token received from Google");
        throw new Error("Failed to get Google ID token");
      }

      console.log("[AUTH] Creating Firebase credential with Google token...");
      const credential = GoogleAuthProvider.credential(idToken);
      console.log("[AUTH] Credential created successfully");
      
      console.log("[AUTH] Signing in to Firebase with credential...");
      const userCred = await signInWithCredential(auth, credential);
      console.log("[AUTH] Firebase sign-in successful:", userCred.user.uid);
      
      console.log("[AUTH] Saving tokens...");
      await this.saveTokens(userCred);
      console.log("[AUTH] Tokens saved successfully");

      console.log("[AUTH] signInWithGoogle completed successfully");
      return userCred.user;
    } catch (error: any) {
      console.error("[AUTH] signInWithGoogle error:", error);
      console.error("[AUTH] Error code:", error.code);
      console.error("[AUTH] Error message:", error.message);
      console.error("[AUTH] Full error:", JSON.stringify(error, null, 2));
      
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
    console.log("[AUTH] signInWithApple started");
    console.log("[AUTH] Identity token exists:", !!identityToken);
    console.log("[AUTH] Raw nonce exists:", !!rawNonce);
    
    if (!identityToken) {
      console.error("[AUTH] Missing Apple identity token");
      throw new Error("Missing Apple identity token");
    }

    try {
      console.log("[AUTH] Creating Apple credential...");
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: rawNonce,
      });
      console.log("[AUTH] Apple credential created successfully");

      console.log("[AUTH] Signing in to Firebase with Apple credential...");
      const userCred = await signInWithCredential(auth, credential);
      console.log("[AUTH] Firebase sign-in successful:", userCred.user.uid);
      
      console.log("[AUTH] Saving tokens...");
      await this.saveTokens(userCred);
      console.log("[AUTH] Tokens saved successfully");
      
      console.log("[AUTH] signInWithApple completed successfully");
      return userCred.user;
    } catch (error: any) {
      console.error("[AUTH] signInWithApple error:", error);
      console.error("[AUTH] Error code:", error.code);
      console.error("[AUTH] Error message:", error.message);
      throw error;
    }
  },

  async logout(): Promise<void> {
    console.log("[AUTH] logout started");
    try {
      const user = auth.currentUser;
      console.log("[AUTH] Current user exists:", !!user);
      const isSignedIn = !!user;

      if (isSignedIn) {
        console.log("[AUTH] Attempting to sign out from Google...");
        try {
          await GoogleSignin.signOut();
          console.log("[AUTH] Google sign-out successful");
        } catch (googleError) {
          console.warn("[AUTH] Google signOut error (may be no active session):", googleError);
        }
      }
    } catch (error) {
      console.warn("[AUTH] Error during logout cleanup:", error);
    }

    console.log("[AUTH] Clearing auth tokens from storage...");
    await storageService.clearAuthTokens();
    console.log("[AUTH] Auth tokens cleared");
    
    console.log("[AUTH] Signing out from Firebase...");
    await signOut(auth);
    console.log("[AUTH] Firebase sign-out successful");
    console.log("[AUTH] logout completed");
  },

  async sendPasswordReset(email: string): Promise<void> {
    console.log("[AUTH] sendPasswordReset started", { email });
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("[AUTH] Password reset email sent successfully");
    } catch (error: any) {
      console.error("[AUTH] sendPasswordReset error:", error);
      console.error("[AUTH] Error code:", error.code);
      throw error;
    }
  },

  async resendVerificationEmail(): Promise<void> {
    console.log("[AUTH] resendVerificationEmail started");
    const user = auth.currentUser;
    console.log("[AUTH] Current user exists:", !!user);
    
    if (!user) {
      console.error("[AUTH] No user logged in");
      throw new Error("No user logged in");
    }
    
    try {
      console.log("[AUTH] Sending verification email...");
      await sendEmailVerification(user);
      console.log("[AUTH] Verification email sent successfully");
    } catch (error: any) {
      console.error("[AUTH] resendVerificationEmail error:", error);
      throw error;
    }
  },

  async saveTokens(userCred: UserCredential): Promise<void> {
    console.log("[AUTH] saveTokens started");
    try {
      console.log("[AUTH] Getting ID token...");
      const token = await userCred.user.getIdToken();
      console.log("[AUTH] ID token retrieved, length:", token?.length);
      
      const refreshToken = userCred.user.refreshToken;
      console.log("[AUTH] Refresh token exists:", !!refreshToken);
      console.log("[AUTH] Refresh token length:", refreshToken?.length);

      if (!token || !refreshToken) {
        console.error("[AUTH] Missing tokens - token:", !!token, "refreshToken:", !!refreshToken);
        throw new Error("Failed to get tokens from user credential");
      }

      console.log("[AUTH] Saving tokens to storage...");
      await storageService.saveAuthTokens(token, refreshToken);
      console.log("[AUTH] Tokens saved successfully");
    } catch (error) {
      console.error("[AUTH] saveTokens error:", error);
      throw new Error("Failed to save authentication tokens");
    }
  },

  async refreshToken(): Promise<string> {
    console.log("[AUTH] refreshToken started");
    try {
      const user = auth.currentUser;
      console.log("[AUTH] Current user exists:", !!user);
      
      if (!user) {
        console.error("[AUTH] No user logged in");
        throw new Error("No user logged in");
      }

      console.log("[AUTH] Forcing token refresh...");
      const token = await user.getIdToken(true);
      console.log("[AUTH] New token retrieved, length:", token?.length);
      
      const refreshToken = user.refreshToken;
      console.log("[AUTH] Refresh token exists:", !!refreshToken);

      console.log("[AUTH] Saving refreshed tokens...");
      await storageService.saveAuthTokens(token, refreshToken);
      console.log("[AUTH] Tokens saved successfully");
      
      console.log("[AUTH] refreshToken completed");
      return token;
    } catch (error) {
      console.error("[AUTH] refreshToken error:", error);
      throw new Error("Failed to refresh authentication token");
    }
  },

  async reloadAndCheckEmailVerified(passedUser?: User): Promise<boolean> {
    console.log("[AUTH] reloadAndCheckEmailVerified started");
    try {
      const user = passedUser || auth.currentUser;
      console.log("[AUTH] User exists:", !!user);
      
      if (!user) {
        console.log("[AUTH] No user to check");
        return false;
      }
      
      console.log("[AUTH] Reloading user data...");
      await user.reload();
      console.log("[AUTH] User reloaded, emailVerified:", user.emailVerified);
      
      return !!user.emailVerified;
    } catch (error) {
      console.error("[AUTH] reloadAndCheckEmailVerified error:", error);
      return false;
    }
  },

  getCurrentUser(): User | null {
    const user = auth.currentUser;
    console.log("[AUTH] getCurrentUser:", !!user);
    if (user) {
      console.log("[AUTH] User ID:", user.uid);
      console.log("[AUTH] Email:", user.email);
      console.log("[AUTH] Email verified:", user.emailVerified);
    }
    return user;
  },

  async getCurrentToken(): Promise<string | null> {
    console.log("[AUTH] getCurrentToken started");
    try {
      const user = auth.currentUser;
      console.log("[AUTH] Current user exists:", !!user);
      
      if (!user) {
        console.log("[AUTH] No current user");
        return null;
      }
      
      console.log("[AUTH] Getting ID token...");
      const token = await user.getIdToken();
      console.log("[AUTH] Token retrieved, length:", token?.length);
      
      return token;
    } catch (error) {
      console.error("[AUTH] getCurrentToken error:", error);
      return null;
    }
  },

  getAuthErrorMessage(code: string): string {
    console.log("[AUTH] getAuthErrorMessage for code:", code);
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
    const message = errorMessages[code] || "Authentication failed. Please try again";
    console.log("[AUTH] Error message:", message);
    return message;
  },
};
