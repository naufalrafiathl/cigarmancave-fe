import { useState } from "react";
import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface HumidorCigar {
  id: number;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
  cigar: {
    id: number;
    name: string;
    brand: string;
  };
}

interface AddCigarData {
  cigarId: number;
  quantity: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
}

interface UpdateCigarData {
  quantity?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  purchaseLocation?: string;
  notes?: string;
}

const formatCigarData = (data: AddCigarData): AddCigarData => {
  return {
    ...data,
    purchasePrice: data?.purchasePrice,
    purchaseDate: data.purchaseDate
      ? new Date(data.purchaseDate).toISOString()
      : new Date().toISOString(),
  };
};

export function useHumidorOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: userLoading } = useUser();

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

  const createHumidor = async (data: {
    name: string;
    description?: string;
    imageUrl?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();

      const profileResponse = await fetch(`${config.apiUrl}/api/auth/profile`, {
        headers,
        credentials: "include",
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to get user profile");
      }

      const userProfile = await profileResponse.json();

      const requestBody = {
        name: data.name.trim(),
        ...(data.description && { description: data.description.trim() }),
        ...(data.imageUrl && { imageUrl: data.imageUrl.trim() }),
        userId: userProfile.user.id,
      };

      const response = await fetch(`${config.apiUrl}/api/humidors`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let parsedResponse;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(parsedResponse.message || "Failed to create humidor");
      }

      return parsedResponse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create humidor";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getHumidors = async (): Promise<Humidor[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/humidors`, {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch humidors");
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch humidors";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHumidor = async (
    humidorId: number,
    data: {
      name?: string;
      description?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}`,
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update humidordsda");
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update humidors";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHumidor = async (humidorId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete humidor");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete humidor";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addCigarToHumidor = async (
    humidorId: number,
    data: AddCigarData
  ): Promise<HumidorCigar> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const formattedData = formatCigarData(data);

      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}/cigars`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to add cigar to humidor");
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add cigar to humidor";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHumidorCigar = async (
    humidorId: number,
    humidorCigarId: number,
    data: UpdateCigarData
  ): Promise<HumidorCigar> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}/cigars/${humidorCigarId}`,
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to update cigar in humidor"
        );
      }

      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update cigar in humidor";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCigarFromHumidor = async (
    humidorId: number,
    humidorCigarId: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}/cigars/${humidorCigarId}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove cigar from humidor");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to remove cigar from humidor";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createHumidor,
    getHumidors,
    updateHumidor,
    deleteHumidor,
    addCigarToHumidor,
    updateHumidorCigar,
    removeCigarFromHumidor,
    isLoading,
    error,
    isAuthenticated: !!user && !userLoading,
  };
}
