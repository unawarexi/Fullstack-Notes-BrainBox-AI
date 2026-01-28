import { create } from "zustand"; 
import { useCurrentUser, useCreateUser, useUpdateUser, useDeleteUser } from "@/core/api/user-api";
import { authService } from "@/core/auth/firebase-auth";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration?: number;
}

interface User {
  id: string;
  email: string;
  name?: string; // added name
  createdAt?: string;
  updatedAt?: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  toast: ToastState;
  setLoading: (v: boolean) => void;
  setUser: (user: User | null) => void;
  setToast: (message: string, type?: ToastType, duration?: number) => void;
  clearToast: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>; // updated signature
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  toast: { visible: false, message: "", type: "info", duration: 3000 },

  setLoading: (v: boolean) => set({ loading: v }),
  setUser: (user: User | null) => set({ user }),

  setToast: (message: string, type: ToastType = "info", duration = 3000) => {
    set({ toast: { visible: true, message, type, duration } });
    if (duration > 0) {
      setTimeout(() => {
        set({ toast: { visible: false, message: "", type: "info", duration: 3000 } });
      }, duration);
    }
  },

  clearToast: () => set({ toast: { visible: false, message: "", type: "info", duration: 3000 } }),

  // Auth actions delegate to authService and update tokens via storageService
  signUp: async (name: string, email: string, password: string) => {
    console.log("[USER-STORE] signUp started", { name, email });
    set({ loading: true });
    try {
      console.log("[USER-STORE] Calling authService.signUp...");
      const firebaseUser = await authService.signUp(name, email, password);
      console.log("[USER-STORE] Firebase user created:", firebaseUser.uid);
      
      const user = { 
        id: firebaseUser.uid, 
        email: firebaseUser.email || "", 
        name: firebaseUser.displayName || name 
      };
      console.log("[USER-STORE] Setting user:", user);
      set({ user });
      
      get().setToast("Verification email sent. Please check your inbox.", "success", 5000);
      console.log("[USER-STORE] signUp completed successfully");
    } catch (err: any) {
      console.error("[USER-STORE] signUp error:", err);
      get().setToast(err?.message || "Sign up failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    console.log("[USER-STORE] signIn started", { email });
    set({ loading: true });
    try {
      console.log("[USER-STORE] Calling authService.signIn...");
      const firebaseUser = await authService.signIn(email, password);
      console.log("[USER-STORE] Firebase user signed in:", firebaseUser.uid);
      console.log("[USER-STORE] Email verified:", firebaseUser.emailVerified);
      
      if (!firebaseUser.emailVerified) {
        console.log("[USER-STORE] Email not verified");
        set({ 
          user: { 
            id: firebaseUser.uid, 
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || undefined
          } 
        });
        get().setToast("Please verify your email first", "warning");
        return;
      }
      
      const user = { 
        id: firebaseUser.uid, 
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || undefined
      };
      console.log("[USER-STORE] Setting user:", user);
      set({ user });
      
      get().setToast("Signed in successfully", "success");
      console.log("[USER-STORE] signIn completed successfully");
    } catch (err: any) {
      console.error("[USER-STORE] signIn error:", err);
      get().setToast(err?.message || "Sign in failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Google sign-in flow
  signInWithGoogle: async () => {
    console.log("[USER-STORE] signInWithGoogle started");
    set({ loading: true });
    try {
      console.log("[USER-STORE] Calling authService.signInWithGoogle...");
      const firebaseUser = await authService.signInWithGoogle();
      console.log("[USER-STORE] Firebase user signed in:", firebaseUser.uid);
      
      const user = { 
        id: firebaseUser.uid, 
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || undefined
      };
      console.log("[USER-STORE] Setting user:", user);
      set({ user });
      
      get().setToast("Signed in with Google successfully", "success");
      console.log("[USER-STORE] signInWithGoogle completed successfully");
    } catch (err: any) {
      console.error("[USER-STORE] signInWithGoogle error:", err);
      get().setToast(err?.message || "Google sign-in failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    console.log("[USER-STORE] signOut started");
    set({ loading: true });
    try {
      console.log("[USER-STORE] Calling authService.logout...");
      await authService.logout();
      console.log("[USER-STORE] Clearing user state...");
      set({ user: null });
      get().setToast("Signed out successfully", "info");
      console.log("[USER-STORE] signOut completed successfully");
    } catch (err: any) {
      console.error("[USER-STORE] signOut error:", err);
      get().setToast(err?.message || "Sign out failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  checkEmailVerified: async () => {
    console.log("[USER-STORE] checkEmailVerified started");
    set({ loading: true });
    try {
      console.log("[USER-STORE] Calling authService.reloadAndCheckEmailVerified...");
      const verified = await authService.reloadAndCheckEmailVerified();
      console.log("[USER-STORE] Email verified:", verified);
      return verified;
    } catch (err) {
      console.error("[USER-STORE] checkEmailVerified error:", err);
      get().setToast("Failed to check verification", "error");
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

// Hook bridge: use the React Query hooks inside components and sync results into the store
export function useUserBridge() {
  const setUser = useUserStore((s) => s.setUser);
  const setToast = useUserStore((s) => s.setToast);
  const setLoading = useUserStore((s) => s.setLoading);

  const currentUserQuery = useCurrentUser();
  const createUserMut = useCreateUser();
  const updateUserMut = useUpdateUser();
  const deleteUserMut = useDeleteUser();

  const fetchCurrentUser = async () => {
    console.log("[USER-BRIDGE] fetchCurrentUser started");
    setLoading(true);
    try {
      console.log("[USER-BRIDGE] Getting Firebase user...");
      const firebaseUser = authService.getCurrentUser();
      console.log("[USER-BRIDGE] Firebase user exists:", !!firebaseUser);
      
      if (!firebaseUser) {
        console.log("[USER-BRIDGE] No Firebase user, clearing state");
        setUser(null);
        return null;
      }

      console.log("[USER-BRIDGE] Fetching user from API...");
      const res = await currentUserQuery.refetch();
      console.log("[USER-BRIDGE] API response:", !!res?.data);
      
      if (res?.data) {
        const mergedUser = {
          ...res.data,
          name: firebaseUser.displayName || res.data.name,
        };
        console.log("[USER-BRIDGE] Setting merged user:", mergedUser);
        setUser(mergedUser);
        return mergedUser;
      }

      console.log("[USER-BRIDGE] API call failed, using Firebase user");
      const fallbackUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || undefined,
      };
      setUser(fallbackUser);
      return null;
    } catch (err: any) {
      console.error("[USER-BRIDGE] Failed to fetch user:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (payload: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await createUserMut.mutateAsync(payload);
      setUser(data);
      setToast("User created", "success");
      return data;
    } catch (err: any) {
      setToast(err?.message || "Create user failed", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, payload: { email?: string; password?: string }) => {
    setLoading(true);
    try {
      const data = await updateUserMut.mutateAsync({ id, payload });
      setUser(data);
      setToast("User updated", "success");
      return data;
    } catch (err: any) {
      setToast(err?.message || "Update user failed", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteUserMut.mutateAsync(id);
      setUser(null);
      setToast("User deleted", "success");
      return true;
    } catch (err: any) {
      setToast(err?.message || "Delete user failed", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUserQuery,
    createUserMut,
    updateUserMut,
    deleteUserMut,
    fetchCurrentUser,
    createUser,
    updateUser,
    deleteUser,
  };
}