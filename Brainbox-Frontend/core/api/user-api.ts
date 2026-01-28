import { authService } from "../auth/firebase-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storageService } from "@/core/services/storage-service";


const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-api.com";

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateUserPayload {
  email: string;
  password: string;
}

interface UpdateUserPayload {
  email?: string;
  password?: string;
}

const getAuthHeaders = async () => {
  console.log("[USER-API] getAuthHeaders started");
  try {
    console.log("[USER-API] Getting current Firebase token...");
    let token = await authService.getCurrentToken();
    console.log("[USER-API] Firebase token exists:", !!token);
    
    if (!token) {
      console.log("[USER-API] No Firebase token, trying storage...");
      token = await storageService.getAccessToken();
      console.log("[USER-API] Storage token exists:", !!token);
    }
    
    if (!token || (await storageService.isTokenExpired())) {
      console.log("[USER-API] Token expired or not found, refreshing...");
      token = await authService.refreshToken();
      console.log("[USER-API] Refreshed token exists:", !!token);
    }
    
    if (!token) {
      console.error("[USER-API] No authentication token available");
      throw new Error("No authentication token available");
    }
    
    console.log("[USER-API] Auth headers created successfully");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error("[USER-API] Error getting auth headers:", error);
    throw new Error("Authentication failed. Please sign in again");
  }
};

// internal api (do NOT export) — React Query hooks are the public API
const api = {
  async getCurrentUser(): Promise<User> {
    console.log("[USER-API] getCurrentUser started");
    try {
      const headers = await getAuthHeaders();
      console.log("[USER-API] Fetching user from:", `${API_URL}/users/me`);
      
      const res = await fetch(`${API_URL}/users/me`, { headers });
      console.log("[USER-API] Response status:", res.status);
      console.log("[USER-API] Response ok:", res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[USER-API] Error response:", errorText);
        throw new Error("Failed to fetch user");
      }
      
      const data = await res.json();
      console.log("[USER-API] User data received:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error("[USER-API] getCurrentUser error:", error);
      throw error;
    }
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    console.log("[USER-API] createUser started", payload);
    try {
      const headers = await getAuthHeaders();
      console.log("[USER-API] Creating user at:", `${API_URL}/users`);
      
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      console.log("[USER-API] Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[USER-API] Error response:", errorText);
        throw new Error("Failed to create user");
      }
      
      const data = await res.json();
      console.log("[USER-API] User created:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error("[USER-API] createUser error:", error);
      throw error;
    }
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    console.log("[USER-API] updateUser started", { id, payload });
    try {
      const headers = await getAuthHeaders();
      console.log("[USER-API] Updating user at:", `${API_URL}/users/${id}`);
      
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      console.log("[USER-API] Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[USER-API] Error response:", errorText);
        throw new Error("Failed to update user");
      }
      
      const data = await res.json();
      console.log("[USER-API] User updated:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error("[USER-API] updateUser error:", error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    console.log("[USER-API] deleteUser started", { id });
    try {
      const headers = await getAuthHeaders();
      console.log("[USER-API] Deleting user at:", `${API_URL}/users/${id}`);
      
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers,
      });
      console.log("[USER-API] Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[USER-API] Error response:", errorText);
        throw new Error("Failed to delete user");
      }
      
      console.log("[USER-API] User deleted successfully");
    } catch (error) {
      console.error("[USER-API] deleteUser error:", error);
      throw error;
    }
  },
};

//------------------------------- Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => api.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
