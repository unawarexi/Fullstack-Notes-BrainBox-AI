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
  try {
    // First try to get current Firebase token
    let token = await authService.getCurrentToken();
    
    // If no Firebase user, try storage
    if (!token) {
      token = await storageService.getAccessToken();
    }
    
    // If token expired or not found, refresh
    if (!token || (await storageService.isTokenExpired())) {
      token = await authService.refreshToken();
    }
    
    if (!token) {
      throw new Error("No authentication token available");
    }
    
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error("Error getting auth headers:", error);
    throw new Error("Authentication failed. Please sign in again");
  }
};

// internal api (do NOT export) — React Query hooks are the public API
const api = {
  async getCurrentUser(): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/me`, { headers });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  async deleteUser(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete user");
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
