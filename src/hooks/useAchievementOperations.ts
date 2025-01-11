import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string | null;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EarnedAchievement extends Achievement {
  earnedAt: string;
}

interface DisplayedAchievementsResponse {
  status: string;
  data: EarnedAchievement[];
}

interface AchievementsResponse {
  status: string;
  data: {
    earned: EarnedAchievement[];
    available: Achievement[];
  };
}

interface BadgePreferences {
  achievementIds: number[];
  displayOrder?: boolean;
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

export function useAchievementOperations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Get all achievements (both earned and available)
  const achievementsQuery = useQuery<AchievementsResponse, APIError>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/achievements`, {
        headers,
        credentials: "include",
      });
      return handleApiResponse<AchievementsResponse>(response);
    },
    enabled: !!user,
  });

  // Get currently displayed achievements
  const displayedAchievementsQuery = useQuery<
    DisplayedAchievementsResponse,
    APIError
  >({
    queryKey: ["displayedAchievements"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/profile/badges`, {
        headers,
        credentials: "include",
      });
      return handleApiResponse<DisplayedAchievementsResponse>(response);
    },
    enabled: !!user,
  });

  // Update badge preferences mutation
  const updateBadgePreferencesMutation = useMutation({
    mutationFn: async (preferences: BadgePreferences) => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/profile/badges`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(preferences),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displayedAchievements"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const isAchievementEarned = (achievementId: number): boolean => {
    return (
      achievementsQuery.data?.data.earned.some((a) => a.id === achievementId) ??
      false
    );
  };

  const getAchievementDetails = (achievementId: number): Achievement | null => {
    if (!achievementsQuery.data?.data) return null;

    const earned = achievementsQuery.data.data.earned.find(
      (a) => a.id === achievementId
    );
    if (earned) return earned;

    const available = achievementsQuery.data.data.available.find(
      (a) => a.id === achievementId
    );
    return available || null;
  };

  const getAchievementsByCategory = (category: string): Achievement[] => {
    if (!achievementsQuery.data?.data) return [];

    return [
      ...achievementsQuery.data.data.earned,
      ...achievementsQuery.data.data.available,
    ].filter((achievement) => {
      return (achievement as any).category === category;
    });
  };

  return {
    achievements: achievementsQuery.data,
    displayedAchievements: displayedAchievementsQuery.data,
    isLoadingAchievements: achievementsQuery.isLoading,
    isLoadingDisplayed: displayedAchievementsQuery.isLoading,
    updateBadgePreferences: updateBadgePreferencesMutation.mutateAsync,
    isUpdatingPreferences: updateBadgePreferencesMutation.isPending,
    isAchievementEarned,
    getAchievementDetails,
    getAchievementsByCategory,
    achievementsError: achievementsQuery.error as APIError | null,
    displayedError: displayedAchievementsQuery.error as APIError | null,
    preferencesError: updateBadgePreferencesMutation.error as APIError | null,
  };
}
