// src/components/profile/ProfileSidebar.tsx
import Image from "next/image";
import { UserCircle, MapPin, Award, Users } from "lucide-react";
import { User } from "@/types/auth";
import { AchievementBadges } from "./AchievementBadges";
import { FollowersInfo } from "./FollowersInfo";

interface ProfileSidebarProps {
  user: User;
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-[25%] bg-[#333333] mb-4 md:mb-0 md:mr-2 rounded-3xl p-4 h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-center">
            <div className="mt-4 md:mt-10 relative w-20 md:w-24 h-20 md:h-24 rounded-full overflow-hidden border border-gray-600">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <UserCircle className="w-8 md:w-12 h-8 md:h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="text-[#FFFFFF] text-center mt-3 md:mt-5 font-semibold break-words px-4">
              {user.fullName}
            </div>

            <div className="flex items-center justify-center text-[#B9B9B9] text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>New York, USA</span>
            </div>

            <AchievementBadges />
            <FollowersInfo />
          </div>
        </div>

        <button className="w-full bg-[#EFA427] hover:bg-[#222222] hover:text-[#EFA427] text-[#010101] rounded-full py-2 text-sm transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
}