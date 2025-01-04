import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation } from "@tanstack/react-query";

interface SignedUrlRequest {
  fileName: string;
  contentType: string;
  folder: string;
}

interface DirectUploadOptions {
  file: File;
  generateVariants?: boolean;
  folder?: string;
}

interface UploadResponse {
  status: string;
  data: {
    original: string;
    thumbnail?: string;
    medium?: string;
  };
}

interface SignedUrlResponse {
  status: string;
  data: {
    signedUrl: string;
  };
}

interface APIError {
  message: string;
  status: number;
}

export function useImageUpload() {
  const { user } = useUser();
  const getApiUrl = (endpoint: string) => `${config.apiUrl}/api${endpoint}`;

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

  const directUploadMutation = useMutation<UploadResponse, APIError, DirectUploadOptions>({
    mutationFn: async ({ file, generateVariants = true, folder = "uploads" }) => {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("generateVariants", generateVariants.toString());
      formData.append("folder", folder);

      const response = await fetch(getApiUrl("/uploads/image"), {
        method: "POST",
        headers: {
          ...headers,
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          message: error.message || "Failed to upload image",
          status: response.status,
        };
      }

      return response.json();
    },
  });

  const getSignedUrlMutation = useMutation<SignedUrlResponse, APIError, SignedUrlRequest>({
    mutationFn: async (request) => {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl("/uploads/signed-url"), {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          message: error.message || "Failed to get signed URL",
          status: response.status,
        };
      }

      return response.json();
    },
  });

  const uploadToSignedUrl = async (signedUrl: string, file: File) => {
    try {
      const response = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload to signed URL");
      }

      return true;
    } catch (error) {
      throw new Error("Failed to upload file using signed URL");
    }
  };

  const validateFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    if (file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit.");
    }

    return true;
  };

  return {
    directUpload: async (options: DirectUploadOptions) => {
      validateFile(options.file);
      return directUploadMutation.mutateAsync(options);
    },
    getSignedUrl: getSignedUrlMutation.mutateAsync,
    uploadToSignedUrl,
    isUploading: directUploadMutation.isPending || getSignedUrlMutation.isPending,
    error: (directUploadMutation.error || getSignedUrlMutation.error) as APIError | null,
    validateFile,
    isAuthenticated: !!user,
  };
}