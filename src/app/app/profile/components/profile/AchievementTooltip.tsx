// components/AchievementTooltip.tsx
import { Trophy, Medal } from "lucide-react";
import Image from "next/image";

interface AchievementTooltipProps {
  achievement: {
    name: string;
    description: string;
    iconUrl: string;
    isPremium: boolean;
  };
  isEarned: boolean;
  earnedAt?: string | null;
}

export function AchievementTooltip({ achievement, isEarned, earnedAt }: AchievementTooltipProps) {
  return (
    <div className="absolute bottom-full mb-2 w-72 transform -translate-x-1/2 left-1/2 z-50">
      <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl p-4 shadow-xl border border-white/10">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="bg-[#363636] p-2 rounded-lg">
              {achievement.iconUrl ? (
                <Image
                  src={achievement.iconUrl}
                  alt={achievement.name}
                  width={50}
                  height={50}
                  className={`object-contain ${isEarned ? "opacity-100" : "opacity-50"}`}
                />
              ) : (
                <Trophy
                  className={`w-6 h-6 ${isEarned ? "text-[#EFA427]" : "text-gray-400"}`}
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
      <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-[#222222] transform -translate-x-1/2 rotate-45 border-r border-b border-white/10" />
    </div>
  );
}