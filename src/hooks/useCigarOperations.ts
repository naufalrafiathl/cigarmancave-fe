import { useState } from "react";
import { config } from "@/config";

interface Cigar {
  id: number;
  name: string;
  brand: string;
  length?: number;
  ringGauge?: number;
  country?: string;
  filler?: string;
  wrapper?: string;
  binder?: string;
  color?: string;
  strength?: string;
}

interface SearchCigarParams {
  query: string;
  page?: number;
  limit?: number;
}

interface SearchResult {
  brandName: string;
  lineName: string;
  similarity: number;
  variants: {
    id: number;
    length: number;
    ringGauge: number;
    wrapper: string;
    strength: string | null;
  }[];
}

interface SearchApiResponse {
  type: "SEARCH_RESULTS";
  total: number;
  data: SearchResult[];
}

export function useCigarOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseErrorResponse = async (response: Response) => {
    try {
      const data = await response.json();
      if (data.error) {
        return data.error;
      } else if (data.message) {
        return typeof data.message === "object"
          ? JSON.stringify(data.message)
          : data.message;
      }
      return `Request failed with status ${response.status}`;
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

  const searchCigars = async (
    params: SearchCigarParams
  ): Promise<SearchApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const queryParams = new URLSearchParams({
        query: params.query,
        ...(params.page && { page: params.page.toString() }),
        ...(params.limit && { limit: params.limit.toString() }),
      });

      const response = await fetch(
        `${config.apiUrl}/api/cigars/search?${queryParams.toString()}`,
        {
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search cigars";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCigar = async (cigarId: number): Promise<Cigar> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/cigars/${cigarId}`, {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch cigar";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createCigar = async (data: Omit<Cigar, "id">): Promise<Cigar> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/cigars`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create cigar";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCigar = async (
    cigarId: number,
    data: Partial<Omit<Cigar, "id">>
  ): Promise<Cigar> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/cigars/${cigarId}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update cigar";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchCigars,
    getCigar,
    createCigar,
    updateCigar,
    isLoading,
    error,
  };
}
