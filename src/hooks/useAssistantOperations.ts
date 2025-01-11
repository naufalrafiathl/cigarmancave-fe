import { config } from "@/config";
import { useUser } from "@/hooks/useUserOperations";
import { useCallback, useMemo } from 'react';

interface CigarInsights {
  history: string;
  blend: string;
  notes: string;
}

interface APIError {
  message: string;
  status: number;
}

export function useAssistOperations() {
  const { user } = useUser();

  const getInsights = useCallback(async (cigarId: number): Promise<CigarInsights> => {
    try {
      const tokenResponse = await fetch("/api/auth/token");
      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }
      const { accessToken } = await tokenResponse.json();

      const response = await fetch(`${config.apiUrl}/api/cigars/${cigarId}/insights`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cigar insights");
      }

      const data = await response.json();
      return data.data as CigarInsights;
    } catch (error) {
      console.error("Error fetching cigar insights:", error);
      throw error;
    }
  }, []);

  const values = useMemo(() => ({
    getInsights,
    isAuthenticated: !!user,
    isPremium: !!user?.isPremium
  }), [getInsights, user]);

  return values;
}