import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, User, UserCredential, updateProfile } from "firebase/auth";
import { auth } from "@/core/config/firebase-config";
import { storageService } from "../services/storage-service";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<User> {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    await sendEmailVerification(userCred.user);
    await this.saveTokens(userCred);
    return userCred.user;
  },

  async signIn(email: string, password: string): Promise<User> {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    await this.saveTokens(userCred);
    return userCred.user;
  },

  async signInWithGoogle(): Promise<User> {
    const userCred = await signInWithPopup(auth, googleProvider);
    await this.saveTokens(userCred);
    return userCred.user;
  },

  async logout(): Promise<void> {
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
    const token = await userCred.user.getIdToken();
    const refreshToken = userCred.user.refreshToken;
    await storageService.saveAuthTokens(token, refreshToken);
  },

  async refreshToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    const token = await user.getIdToken(true);
    await storageService.saveAuthTokens(token, user.refreshToken);
    return token;
  },

  // Reload current Firebase user and return whether their email is verified
  async reloadAndCheckEmailVerified(passedUser?: User): Promise<boolean> {
    const user = passedUser || auth.currentUser;
    if (!user) return false;
    await user.reload();
    return !!user.emailVerified;
  },
};
