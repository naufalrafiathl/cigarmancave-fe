import { Award } from "lucide-react";

export function AchievementBadges() {
  return (
    <div className="flex justify-center space-x-2">
      <div title="Master Roller">
        <Award className="w-6 h-6 text-yellow-500" />
      </div>
      <div title="Flavor Expert">
        <Award className="w-6 h-6 text-blue-500" />
      </div>
      <div title="Collector">
        <Award className="w-6 h-6 text-green-500" />
      </div>
    </div>
  );
}
