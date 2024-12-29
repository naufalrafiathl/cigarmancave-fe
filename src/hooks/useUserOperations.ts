// hooks/useUserOperations.ts
import { useState,useEffect } from "react";
import { config } from "@/config";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";

interface User {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

export function useUserOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: auth0User, isLoading: userLoading } = useAuth0User();

  const parseErrorResponse = async (response: Response) => {
    try {
      const data = await response.json();
      if (data.error) {
        return data.error;
      } else if (data.message) {
        return typeof data.message === "object"
          ? JSON.stringify(data.message)
          : data.message;
      } else {
        return `Request failed with status ${response.status}`;
      }
    } catch (e) {
      return `Request failed with status ${response.status}`;
    }
  };

  const getAuthHeaders = async () => {
    try {
      const tokenResponse = await fetch("/api/auth/token");
      if (!tokenResponse.ok) {
        const errorMessage = await parseErrorResponse(tokenResponse);
        throw new Error(errorMessage);
      }
      const { accessToken } = await tokenResponse.json();

      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
    } catch (err) {
      console.error("Error getting auth headers:", err);
      throw new Error(
        err instanceof Error ? err.message : "Authentication failed"
      );
    }
  };

  const getCurrentUser = async (): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/auth/profile`, {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user profile";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCurrentUser,
    isLoading,
    error,
    isAuthenticated: !!auth0User && !userLoading,
  };
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const { getCurrentUser, isLoading, error } = useUserOperations();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
  };
}

export type { User };