import { useMutation } from "@tanstack/react-query";
import { config } from "@/config";

export interface ImportResult {
  processingResult: {
    success: boolean;
    data: ImportedCigar[];
    method: string;
    confidence: number;
    cost: number;
    duration: number;
  };
  matches: {
    exactMatches: ExactMatch[];
    possibilities: PossibilityMatch[];
    newEntries: ImportedCigar[];
  };
}

export interface ImportedCigar {
  brand: string;
  name: string;
  quantity: number;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  purchaseLocation?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  length?: number | null;
  ringGauge?: number | null;
  country?: string | null;
  wrapper?: string | null;
  binder?: string | null;
  filler?: string | null;
  color?: string | null;
  strength?: string | null;
}

export interface ExactMatch {
  importData: ImportedCigar;
  existingCigar: {
    id: number;
    name: string;
    brand: {
      id: number;
      name: string;
    };
  };
}

export interface PossibilityMatch {
  importData: ImportedCigar;
  possibleMatches: Array<{
    id: number;
    name: string;
    brand: {
      id: number;
      name: string;
    };
  }>;
  scores: Array<{
    similarity: number;
    matchDetails: string[];
  }>;
}

export interface ImportConfirmation {
  matchType: "exact" | "possible" | "new";
  selectedCigarId?: number;
  importData?: ImportedCigar;
  addToHumidor?: boolean;
  humidorId?: number;
  humidorData?: {
    quantity?: number;
    purchasePrice?: number;
    purchaseDate?: string;
    purchaseLocation?: string;
    notes?: string;
    imageUrl?: string;
  };
}
export interface ImportQuota {
  images: {
    used: number;
    total: number;
    remaining: number;
  };
  documents: {
    used: number;
    total: number;
    remaining: number;
  };
}

export interface ImportConfirmationResult {
  created: number;
  matched: number;
  addedToHumidor: number;
  errors: string[];
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
      status: response.status,
    }));

    throw new Error(
      errorData.message || "An error occurred while processing your request"
    );
  }

  return response.json();
};

const getAuthHeaders = async () => {
  const tokenResponse = await fetch("/api/auth/token");
  if (!tokenResponse.ok) {
    throw new Error("Failed to get authentication token");
  }

  const { accessToken } = await tokenResponse.json();
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export function useImportOperations() {
  const getQuotaMutation = useMutation({
    mutationFn: async (): Promise<{ status: string; data: ImportQuota }> => {
      const headers = await getAuthHeaders();

      const response = await fetch(`${config.apiUrl}/api/import/quota`, {
        method: "GET",
        headers: {
          ...headers,
        },
        credentials: "include",
      });

      return handleApiResponse(response);
    },
  });
  const processImportMutation = useMutation({
    mutationFn: async (
      file: File
    ): Promise<{ status: string; data: ImportResult }> => {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiUrl}/api/import/process`, {
        method: "POST",
        headers: {
          ...headers,
        },
        credentials: "include",
        body: formData,
      });

      return handleApiResponse(response);
    },
  });

  const confirmImportMutation = useMutation({
    mutationFn: async (
      selections: ImportConfirmation[]
    ): Promise<{ status: string; data: ImportConfirmationResult }> => {
      const headers = await getAuthHeaders();

      const response = await fetch(`${config.apiUrl}/api/import/confirm`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ selections }),
      });

      return handleApiResponse(response);
    },
  });

  return {
    processImport: processImportMutation.mutateAsync,
    confirmImport: confirmImportMutation.mutateAsync,
    getQuota: getQuotaMutation.mutateAsync,
    isProcessing: processImportMutation.isPending,
    isConfirming: confirmImportMutation.isPending,
    processError: processImportMutation.error,
    confirmError: confirmImportMutation.error,
  };
}
