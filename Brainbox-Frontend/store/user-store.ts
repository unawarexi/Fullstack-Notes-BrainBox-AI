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
      const user = await authService.signUp(name, email, password);
      // tokens are stored by authService.saveTokens
      set({ user: { id: user.uid, email: user.email || "", name: user.displayName || name } });
      get().setToast("Verification email sent", "info");
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
      const user = await authService.signIn(email, password);
      set({ user: { id: user.uid, email: user.email || "" } });
      get().setToast("Signed in", "success");
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
      const user = await authService.signInWithGoogle();
      set({ user: { id: user.uid, email: user.email || "" } });
      get().setToast("Signed in with Google", "success");
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
      get().setToast("Signed out", "info");
    } catch (err: any) {
      get().setToast(err?.message || "Sign out failed", "error");
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
      const res = await currentUserQuery.refetch();
      if (res?.data) setUser(res.data);
      return res?.data ?? null;
    } catch (err: any) {
      setUser(null);
      setToast(err?.message || "Failed to fetch user", "error");
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