import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface UpdateProfileData {
  fullName?: string;
  location?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface ProfileResponse {
  data: {
    id: number;
    fullName: string;
    location: string;
    phoneNumber: string;
    profileImageUrl: string;
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

export function useProfileOperations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<ProfileResponse> => {
      const headers = await getAuthHeaders();

      const response = await fetch(`${config.apiUrl}/api/profile`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      return handleApiResponse<ProfileResponse>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File): Promise<{ data: { profileImageUrl: string } }> => {
      const formData = new FormData();
      formData.append("image", file);

      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/profile/image`, {
        method: "POST",
        headers: {
          Authorization: headers.Authorization,
        },
        credentials: "include",
        body: formData,
      });

      return handleApiResponse<{ data: { profileImageUrl: string } }>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const headers = await getAuthHeaders();

      const response = await fetch(`${config.apiUrl}/api/profile/image`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });

      return handleApiResponse<void>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  // Query function for getting profile
  const getProfileQuery = async (): Promise<ProfileResponse> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${config.apiUrl}/api/profile`, {
      headers,
      credentials: "include",
    });

    return handleApiResponse<ProfileResponse>(response);
  };

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    getProfile: getProfileQuery,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadImageMutation.isPending,
    isDeleting: deleteImageMutation.isPending,
    error: (updateProfileMutation.error || uploadImageMutation.error || deleteImageMutation.error) as APIError | null,
    isAuthenticated: !!user,
  };
}