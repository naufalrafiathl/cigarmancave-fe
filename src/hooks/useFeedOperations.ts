// src/hooks/useFeedOperations.ts
import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type FeedSortType = "recent" | "top" | "hot";
export type FeedFilterType = "all" | "reviews" | "general";

interface FeedOptions {
  page?: number;
  limit?: number;
  sortBy?: FeedSortType;
  filterBy?: FeedFilterType;
  startDate?: Date;
  endDate?: Date;
}

interface APIError {
  message: string;
  status: number;
}

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

export function useFeedOperations() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const getApiUrl = (endpoint: string) => `${config.apiUrl}/api${endpoint}`;

  const createPostMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      imageUrls?: string[];
      reviewId?: number;
    }) => {
      const headers = await getAuthHeaders();

      const response = await fetch(getApiUrl("/posts"), {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });

      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const getFeedQuery = async (options: FeedOptions = {}) => {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (options.page) queryParams.append("page", options.page.toString());
    if (options.limit) queryParams.append("limit", options.limit.toString());
    if (options.sortBy) queryParams.append("sortBy", options.sortBy);
    if (options.filterBy) queryParams.append("filterBy", options.filterBy);
    if (options.startDate)
      queryParams.append("startDate", options.startDate.toISOString());
    if (options.endDate)
      queryParams.append("endDate", options.endDate.toISOString());

    const response = await fetch(
      getApiUrl("/feed") + "?" + queryParams.toString(),
      {
        headers,
        credentials: "include",
      }
    );

    return handleApiResponse(response);
  };

  const toggleLikeMutation = useMutation({
    mutationFn: async ({
      postId,
      isLiked,
    }: {
      postId: number;
      isLiked: boolean;
    }) => {
      const headers = await getAuthHeaders();
      const url = `${config.apiUrl}/api/posts/${postId}/like`;
      console.log("Like endpoint URL:", url);
      const response = await fetch(getApiUrl(`/posts/${postId}/like`), {
        method: isLiked ? "DELETE" : "POST",
        headers,
        credentials: "include",
      });

      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueriesData({ queryKey: ["feed"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((post: any) =>
                post.id === variables.postId
                  ? {
                      ...post,
                      engagement: {
                        ...post.engagement,
                        totalLikes: variables.isLiked
                          ? post.engagement.totalLikes - 1
                          : post.engagement.totalLikes + 1,
                      },
                      isLiked: !variables.isLiked,
                    }
                  : post
              ),
            },
          })),
        };
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
      parentId,
    }: {
      postId: number;
      content: string;
      parentId?: number;
    }) => {
      const headers = await getAuthHeaders();

      const response = await fetch(getApiUrl(`/posts/${postId}/comments`), {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ content, parentId }),
      });

      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return {
    createPost: createPostMutation.mutateAsync,
    getFeed: getFeedQuery,
    toggleLike: toggleLikeMutation.mutateAsync,
    addComment: addCommentMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    error: createPostMutation.error as APIError | null,
    isAuthenticated: !!user,
  };
}
