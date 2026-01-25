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
    set({ loading: true });
    try {
      const firebaseUser = await authService.signUp(name, email, password);
      set({ 
        user: { 
          id: firebaseUser.uid, 
          email: firebaseUser.email || "", 
          name: firebaseUser.displayName || name 
        } 
      });
      get().setToast("Verification email sent. Please check your inbox.", "success", 5000);
    } catch (err: any) {
      get().setToast(err?.message || "Sign up failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const firebaseUser = await authService.signIn(email, password);
      
      // Check email verification
      if (!firebaseUser.emailVerified) {
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
      
      set({ 
        user: { 
          id: firebaseUser.uid, 
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || undefined
        } 
      });
      get().setToast("Signed in successfully", "success");
    } catch (err: any) {
      get().setToast(err?.message || "Sign in failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Google sign-in flow
  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      const firebaseUser = await authService.signInWithGoogle();
      set({ 
        user: { 
          id: firebaseUser.uid, 
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || undefined
        } 
      });
      get().setToast("Signed in with Google successfully", "success");
    } catch (err: any) {
      get().setToast(err?.message || "Google sign-in failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      set({ user: null });
      get().setToast("Signed out successfully", "info");
    } catch (err: any) {
      get().setToast(err?.message || "Sign out failed", "error");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  checkEmailVerified: async () => {
    set({ loading: true });
    try {
      const verified = await authService.reloadAndCheckEmailVerified();
      return verified;
    } catch (err) {
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
    setLoading(true);
    try {
      const firebaseUser = authService.getCurrentUser();
      if (!firebaseUser) {
        setUser(null);
        return null;
      }

      const res = await currentUserQuery.refetch();
      if (res?.data) {
        const mergedUser = {
          ...res.data,
          name: firebaseUser.displayName || res.data.name,
        };
        setUser(mergedUser);
        return mergedUser;
      }

      // If API call fails but we have Firebase user, use that
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || undefined,
      });
      return null;
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      // Don't show error toast here - let calling code handle it
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