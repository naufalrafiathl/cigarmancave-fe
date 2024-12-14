import { useState } from "react";
import { config } from "@/config";
import { useUser } from '@auth0/nextjs-auth0/client';

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
  

export function useHumidorOperations() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, error: userError, isLoading: userLoading } = useUser();
    console.log('token',user)
    const createHumidor = async (data: { 
      name: string; 
      description?: string; 
      imageUrl?: string; 
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.apiUrl}/api/humidors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create humidor");
        }
  
        const result = await response.json();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create humidor");
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

  const updateHumidor = async (id: number, data: Partial<Humidor>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiUrl}/api/humidors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update humidor");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update humidor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHumidor = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiUrl}/api/humidors/${id}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to delete humidor");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete humidor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addCigarToHumidor = async (
    humidorId: number,
    data: Omit<HumidorCigar, "id" | "cigar"> & { cigarId: number }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiUrl}/api/humidors/${humidorId}/cigars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add cigar to humidor");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add cigar to humidor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateHumidorCigar = async (
    humidorId: number,
    humidorCigarId: number,
    data: Partial<Omit<HumidorCigar, "id" | "cigar">>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}/cigars/${humidorCigarId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cigar in humidor");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cigar in humidor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCigarFromHumidor = async (humidorId: number, humidorCigarId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/humidors/${humidorId}/cigars/${humidorCigarId}`,
        {
          method: "DELETE",
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove cigar from humidor");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove cigar from humidor");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createHumidor,
    updateHumidor,
    deleteHumidor,
    addCigarToHumidor,
    updateHumidorCigar,
    removeCigarFromHumidor,
  };
}