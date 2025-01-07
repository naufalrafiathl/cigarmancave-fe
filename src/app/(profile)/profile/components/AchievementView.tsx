"use client";
import React, { useState, useEffect } from "react";
import { useAchievementOperations } from "@/hooks/useAchievementOperations";
import { Trophy, Medal, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string | null;
  isPremium: boolean;
}

interface EarnedAchievement extends Achievement {
  earnedAt: string;
}

interface AchievementCardProps {
  achievement: Achievement | EarnedAchievement;
  isEarned: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

// Update the type for the achievements data
interface AchievementsData {
  earned: EarnedAchievement[];
  available: Achievement[];
}

interface AchievementsResponse {
  earned: EarnedAchievement[];
  available: Achievement[];
}

type FilterType = "all" | "earned" | "available";

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isEarned,
  isSelected,
  onSelect,
}) => {
  const earnedAt = isEarned
    ? (achievement as EarnedAchievement).earnedAt
    : null;

  return (
    <div
      className={`bg-gradient-to-br from-[#2A2A2A] to-[#222222] border rounded-xl transition-all duration-300 cursor-pointer relative
          ${
            isSelected
              ? "border-[#EFA427] ring-2 ring-[#EFA427]/50"
              : isEarned
              ? "border-white/10 hover:border-[#EFA427]"
              : "border-white/5 opacity-50"
          }`}
      onClick={onSelect}
    >
      {/* Add a selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#EFA427] rounded-full p-1">
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="bg-[#363636] p-2 rounded-lg">
            {achievement.iconUrl ? (
              <Image
                src={achievement.iconUrl}
                alt={achievement.name}
                width={50}
                height={50}
                className={`object-contain ${
                  isEarned ? "opacity-100" : "opacity-50"
                }`}
              />
            ) : (
              <Trophy
                className={`w-6 h-6 ${
                  isEarned ? "text-[#EFA427]" : "text-gray-400"
                }`}
              />
            )}
          </div>
          {isEarned && (
            <div className="bg-[#EFA427]/10 px-3 py-1 rounded-full">
              <span className="text-[#EFA427] text-sm">Earned</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-white text-lg">
            {achievement.name}
          </h3>
          <p className="text-[#B9B9B9] text-sm mt-1">
            {achievement.description}
          </p>
        </div>

        {isEarned && earnedAt && (
          <div className="text-[#B9B9B9] text-sm">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </div>
        )}

        {achievement.isPremium && (
          <div className="flex items-center gap-2">
            <Medal className="w-4 h-4 text-[#EFA427]" />
            <span className="text-[#EFA427] text-sm">Premium Achievement</span>
          </div>
        )}
      </div>
    </div>
  );
};

export function AchievementView(): JSX.Element {
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [selectedAchievements, setSelectedAchievements] = useState<Set<number>>(
    new Set()
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    achievements,
    displayedAchievements,
    isLoadingAchievements,
    updateBadgePreferences,
    isUpdatingPreferences,
    achievementsError,
  } = useAchievementOperations();

  // Handle achievement selection
  const toggleAchievement = (achievementId: number): void => {
    const newSelected = new Set(selectedAchievements);
    if (newSelected.has(achievementId)) {
      newSelected.delete(achievementId);
    } else if (newSelected.size < 3) {
      newSelected.add(achievementId);
    }
    setSelectedAchievements(newSelected);
  };

  // Save displayed achievements
  const handleSaveSelection = async (): Promise<void> => {
    try {
      await updateBadgePreferences({
        achievementIds: Array.from(selectedAchievements),
        displayOrder: true,
      });
    } catch (error) {
      console.error("Failed to update achievements:", error);
    }
  };

  // Filter achievements
  const filteredAchievements = React.useMemo(() => {
    const defaultValue = { earned: [], available: [] };
    if (!achievements?.data) return defaultValue;

    if (filterBy === "earned") {
      return { earned: achievements.data.earned, available: [] };
    }
    if (filterBy === "available") {
      return { earned: [], available: achievements.data.available };
    }
    return achievements.data;
  }, [achievements, filterBy]);
  console.log("ini display", displayedAchievements);
  useEffect(() => {
    if (displayedAchievements?.data && Array.isArray(displayedAchievements.data)) {
      setSelectedAchievements(
        new Set(displayedAchievements.data.map((achievement) => achievement.id))
      );
    }
  }, [displayedAchievements]);

  if (achievementsError) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-red-400">
          Failed to load achievements: {achievementsError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Achievements
              </h2>
              <p className="text-[#B9B9B9]">Track your progress</p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={filterBy}
                onValueChange={(value: FilterType) => setFilterBy(value)}
              >
                <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-white/10 text-white">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-white/10">
                  <SelectItem value="all">All Achievements</SelectItem>
                  <SelectItem value="earned">Earned Only</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoadingAchievements ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
          </div>
        ) : (
          <>
            {/* Badge Selection Section */}
            {selectedAchievements.size > 0 && (
              <div className="mb-8 bg-gradient-to-br from-[#2A2A2A] to-[#232323] rounded-xl p-4 border border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Display Badges
                    </h3>
                    <p className="text-[#B9B9B9] text-sm">
                      Select up to 3 achievements to display on your profile
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSelection}
                    disabled={isUpdatingPreferences}
                    className="px-4 py-2 bg-[#EFA427] hover:bg-[#EFA427]/90 disabled:opacity-50 
                      rounded-xl text-white font-medium transition-colors flex items-center gap-2"
                  >
                    {isUpdatingPreferences ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Medal className="w-4 h-4" />
                    )}
                    Save Selection
                  </button>
                </div>
              </div>
            )}

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.earned.map((achievement: any) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={true}
                  isSelected={selectedAchievements.has(achievement.id)}
                  onSelect={() => toggleAchievement(achievement.id)}
                />
              ))}
              {filteredAchievements.available.map((achievement: any) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={false}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
