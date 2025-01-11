"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UserCircle, MapPin, Award, Users } from "lucide-react";
import { User } from "@/types/auth";
import { AchievementBadges } from "./AchievementBadges";
import { FollowersInfo } from "./FollowersInfo";
import EditProfileModal from "./EditProfileModal";
import { OnboardingModal } from "./OnboardingModal";

interface ProfileSidebarProps {
  user: User;
  className?: string;
}

export function ProfileSidebar({ user, className = "" }: ProfileSidebarProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!user?.isOnboarded);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <aside
        className={`w-full lg:w-80 md:w-72 bg-neutral-800 rounded-3xl p-4 md:p-6 flex flex-col h-full ${className}`}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Profile Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-neutral-600 transition-transform hover:scale-105">
            {user?.profileImageUrl ? (
              <Image
                src={user?.profileImageUrl}
                alt={`${user?.fullName}'s profile picture`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 96px, 128px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-700">
                <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400" />
              </div>
            )}
          </div>

          {/* Name and Location */}
          <div className="md:mt-4 text-left md:text-center flex-grow md:flex-grow-0">
            <h2 className="text-white text-lg sm:text-xl font-semibold">
              {user?.fullName}
            </h2>
            <div className="flex items-center md:justify-center text-neutral-400 mt-1 md:mt-2 text-sm">
              <MapPin className="w-4 h-4 mr-1.5" />
              <span>{user?.location}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-6 space-y-6 flex-grow overflow-y-auto">
          {/* Achievement Badges */}
          <div className="bg-neutral-700/30 rounded-2xl p-4">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="text-white text-sm font-medium">Badges</h3>
            </div>
            <AchievementBadges />
            <div className="text-white text-sm mt-5 justify-end text-center underline bg-red bg-[#222222] mx-auto p-2 rounded-xl">View all achievements</div>
          </div>

          {/* Followers Info */}
          <div className="bg-neutral-700/30 rounded-2xl p-4">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="text-white text-sm font-medium">Community</h3>
            </div>
            <FollowersInfo />
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex-shrink-0">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-black w-full bg-amber-500 hover:bg-amber-600 font-medium rounded-xl py-2.5 px-4 text-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
          >
            Edit Profile
          </button>
        </div>
      </aside>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={{
          fullName: user?.fullName,
          location: user?.location,
          profileImageUrl: user?.profileImageUrl,
        }}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        currentProfile={{
          fullName: user?.fullName || "",
          location: user?.location || "",
          profileImageUrl: user?.profileImageUrl || "",
        }}
      />
    </>
  );
}
