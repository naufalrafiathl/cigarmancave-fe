import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types

export interface ReviewPairing {
  name: string;
  type: string;
  notes?: string;
}

interface Pairing {
    id: number;
    reviewId: number;
    pairingId: number;
    notes: string | null;
    pairing: {
      id: number;
      name: string;
      type: string;
    };
  }

export interface ReviewData {
  cigarId: number;
  duration: number;
  cigarStrength?: string;
  constructionScore?: number;
  drawScore?: number;
  flavorScore?: number;
  burnScore?: number;
  impressionScore?: number;
  flavorPepperScore?: number;
  flavorChocolateScore?: number;
  flavorCreamyScore?: number;
  flavorLeatherScore?: number;
  flavorWoodyScore?: number;
  flavorEarthyScore?: number;
  flavorNuttyScore?: number;
  flavorSweetScore?: number;
  flavorFruityScore?: number;
  flavorGrassyScore?: number;
  flavorBerryScore?: number;
  flavorCoffeeScore?: number;
  flavorBittersScore?: number;
  notes?: string;
  buyAgain?: boolean;
  pairings?: ReviewPairing[];
  images?: string[];
}

export interface ReviewResponse {
    data: {};
    id: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
    buyAgain: boolean;
    date: string;
    overallScore: number;
    constructionScore: number;
    drawScore: number;
    flavorScore: number;
    burnScore:number;
    impressionScore: number;
    notes: string;
    // Flavor scores
    flavorPepperScore: number;
    flavorChocolateScore: number;
    flavorCreamyScore: number;
    flavorLeatherScore: number;
    flavorWoodyScore: number;
    flavorEarthyScore: number;
    flavorNuttyScore: number;
    flavorSweetScore: number;
    flavorFruityScore: number;
    flavorGrassyScore: number;
    flavorBerryScore: number;
    flavorCoffeeScore: number;
    flavorBittersScore: number;
    user: {
      id: number;
      fullName: string;
      profileImageUrl: string;
    };
    pairings: Pairing[],
    cigar: {
      id: number;
      name: string;
      brand: string;
    };
  }

export interface ReviewsResponse {
  // Make sure it's exported
  reviews: ReviewResponse[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}

interface APIError {
  message: string;
  status: number;
}

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
      status: response.status,
    }));

    throw {
      message:
        errorData.message || "An error occurred while processing your request",
      status: response.status,
    } as APIError;
  }

  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const tokenResponse = await fetch("/api/auth/token");
  if (!tokenResponse.ok) {
    throw new Error("Failed to get authentication token");
  }

  const { accessToken } = await tokenResponse.json();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

export function useReviewOperations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: ReviewData): Promise<ReviewResponse> => {
      const headers = await getAuthHeaders();

      console.log(reviewData);
      const response = await fetch(`${config.apiUrl}/api/reviews`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      return handleApiResponse<ReviewResponse>(response);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });

  const getReviewQuery = async (reviewId: number): Promise<ReviewResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${config.apiUrl}/api/reviews/${reviewId}`, {
      headers,
      credentials: "include",
    });

    return handleApiResponse<ReviewResponse>(response);
  };

  const getReviewsQuery = async (params: {
    cigarId?: number;
    userId?: number;
    page?: number;
    limit?: number;
  }) => {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params.cigarId)
      queryParams.append("cigarId", params.cigarId.toString());
    if (params.userId) queryParams.append("userId", params.userId.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${config.apiUrl}/api/reviews?${queryParams.toString()}`,
      {
        headers,
        credentials: "include",
      }
    );

    return handleApiResponse<{
      data: {
        reviews: ReviewResponse[];
        pagination: {
          total: number;
          pages: number;
          currentPage: number;
          perPage: number;
        };
      };
    }>(response);
  };

  // Upload image and get URL
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const headers = await getAuthHeaders();
    const response = await fetch(`${config.apiUrl}/api/uploads/image`, {
      method: "POST",
      headers: {
        Authorization: headers.Authorization,
      },
      body: formData,
    });

    const data = await handleApiResponse<{ url: string }>(response);
    return data.url;
  };

  return {
    createReview: createReviewMutation.mutateAsync,
    getReview: getReviewQuery,
    getReviews: getReviewsQuery,
    uploadImage,
    isCreating: createReviewMutation.isPending,
    error: createReviewMutation.error as APIError | null,
    isAuthenticated: !!user,
  };
}
