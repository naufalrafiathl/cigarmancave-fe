"use client";
import { useAchievementOperations } from "@/hooks/useAchievementOperations";
import { Trophy, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AchievementTooltip } from "./AchievementTooltip";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  isPremium: boolean;
}

interface EarnedAchievement extends Achievement {
  earnedAt: string;
}

interface AchievementsResponse {
  status: string;
  data: (Achievement | EarnedAchievement)[];
}

export function AchievementBadges() {
  const { displayedAchievements, isLoadingDisplayed, displayedError } =
    useAchievementOperations();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredId(id);
  };

  if (isLoadingDisplayed) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
      </div>
    );
  }

  if (displayedError) {
    return (
      <div className="flex justify-center text-red-400">
        Failed to load achievements
      </div>
    );
  }

  const achievementsArray =
    (displayedAchievements as unknown as AchievementsResponse)?.data || [];

  return (
    <div className="flex justify-center gap-2 mb-5">
      {achievementsArray.map((achievement) => {
        const isEarned = "earnedAt" in achievement;

        return (
          <div
            key={achievement.id}
            className="relative"
            onMouseEnter={(e) => handleMouseEnter(e, achievement.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="bg-[#222222] rounded-xl p-2 w-15 h-15 flex items-center justify-center transition-all duration-300 hover:ring-2 hover:ring-[#EFA427]/50">
              {achievement.iconUrl ? (
                <div className="relative w-14 h-14">
                  <Image
                    src={achievement.iconUrl}
                    alt={`${achievement.name} Achievement`}
                    fill
                    className="object-contain"
                    onError={() => {
                      // Fallback to Trophy icon
                      return <Trophy className="w-8 h-8 text-[#EFA427]" />;
                    }}
                  />
                </div>
              ) : (
                <Trophy className="w-8 h-8 text-[#EFA427]" />
              )}
            </div>

            {hoveredId === achievement.id &&
              isMounted &&
              createPortal(
                <div
                  className="fixed z-[9999] transform -translate-x-1/2 -translate-y-full"
                  style={{
                    top: `${tooltipPosition.y}px`,
                    left: `${tooltipPosition.x}px`,
                  }}
                >
                  <AchievementTooltip
                    achievement={achievement}
                    isEarned={isEarned}
                    earnedAt={
                      isEarned
                        ? (achievement as EarnedAchievement).earnedAt
                        : null
                    }
                  />
                </div>,
                document.body
              )}
          </div>
        );
      })}
    </div>
  );
}