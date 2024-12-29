import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

interface CreatePostData {
  content: string;
  imageUrls?: string[];
  reviewId?: number;
}

interface CommentData {
  postId: number;
  content: string;
  parentId?: number;
}

interface UpdateCommentData {
  postId: number;
  commentId: number;
  content: string;
}

interface LikeData {
  postId: number;
  isLiked: boolean;
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

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null as T;
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

  const getFeed = async (options: FeedOptions = {}) => {
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

  const getPost = async (postId: number) => {
    const headers = await getAuthHeaders();
    const response = await fetch(getApiUrl(`/posts/${postId}`), {
      headers,
      credentials: "include",
    });
    return handleApiResponse(response);
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
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
      toast.success("Post created successfully");
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`/posts/${postId}`), {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Post deleted successfully");
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to delete post");
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: LikeData) => {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`/posts/${postId}/like`), {
        method: isLiked ? "DELETE" : "POST",
        headers,
        credentials: "include",
      });
      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success(variables.isLiked ? "Post unliked" : "Post liked");
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to update like");
    },
  });

  const getPostComments = async (
    postId: number,
    options: { page?: number; limit?: number; parentId?: number } = {}
  ) => {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (options.page) queryParams.append("page", options.page.toString());
    if (options.limit) queryParams.append("limit", options.limit.toString());
    if (options.parentId)
      queryParams.append("parentId", options.parentId.toString());

    const response = await fetch(
      getApiUrl(`/posts/${postId}/comments?${queryParams.toString()}`),
      {
        headers,
        credentials: "include",
      }
    );
    return handleApiResponse(response);
  };

  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, content, parentId }: CommentData) => {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`/posts/${postId}/comments`), {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ content, parentId }),
      });
      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success(
        variables.parentId
          ? "Reply added successfully"
          : "Comment added successfully"
      );
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to add comment");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ postId, commentId, content }: UpdateCommentData) => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        getApiUrl(`/posts/${postId}/comments/${commentId}`),
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", variables.postId],
      });
      toast.success("Comment updated successfully");
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to update comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        getApiUrl(`/posts/${postId}/comments/${commentId}`),
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );
      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success("Comment deleted successfully");
    },
    onError: (error: APIError) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });

  const reportPost = async (postId: number, reason: string) => {
    toast.success("Post reported successfully");
  };

  return {
    getFeed,
    getPost,
    createPost: createPostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    toggleLike: toggleLikeMutation.mutateAsync,
    reportPost,
    getPostComments,
    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    error: createPostMutation.error as APIError | null,
    isAuthenticated: !!user,
  };
}
