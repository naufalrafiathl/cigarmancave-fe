import { Users } from "lucide-react";

export function FollowersInfo() {
    return (
      <div className="flex justify-center space-x-4 text-[#B9B9B9] text-sm">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>128 followers</span>
        </div>
        <div className="text-[#666666]">|</div>
        <div>
          <span>89 following</span>
        </div>
      </div>
    );
  }