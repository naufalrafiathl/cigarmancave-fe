import React from 'react';
import { Upload, Trash2 } from "lucide-react";
import Image from "next/image";
import { LocationSelector } from '@/components/LocationSelector';

interface ProfileFormProps {
  profileData: {
    fullName: string;
    location: string;
    profileImageUrl: string;
  };
  onProfileChange: (data: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: () => void;
  isUploading: boolean;
  isDeleting: boolean;
}

export function ProfileFormStep({
  profileData,
  onProfileChange,
  onImageUpload,
  onImageDelete,
  isUploading,
  isDeleting
}: ProfileFormProps) {
  return (
    <div className="w-full space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24">
          {profileData.profileImageUrl ? (
            <>
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-amber-500">
                <Image
                  src={profileData.profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={onImageDelete}
                className="absolute -bottom-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <label className="w-full h-full rounded-full bg-neutral-800 border-2 border-dashed border-neutral-600 flex items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-neutral-700 transition-all duration-300">
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-6 h-6 text-neutral-400 group-hover:text-amber-500" />
                <span className="text-xs text-neutral-400 group-hover:text-amber-500">
                  {isUploading ? "Uploading..." : "Upload"}
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        <p className="text-neutral-400 text-sm">Profile Picture</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 w-full">
        {/* Name Input */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300">
            Full Name <span className="text-amber-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={profileData.fullName}
            onChange={(e) =>
              onProfileChange({ ...profileData, fullName: e.target.value })
            }
            placeholder="Enter your full name"
            className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-neutral-500"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-300">
            Location <span className="text-amber-500">*</span>
          </label>
          <LocationSelector
            value={profileData.location}
            onChange={(location) =>
              onProfileChange({ ...profileData, location })
            }
          />
          <p className="text-neutral-500 text-xs">
            Select your country and city
          </p>
        </div>
      </div>

      {/* Beta Badge Info */}
      <div className="text-center">
        <p className="text-neutral-400 text-sm">
          Complete your profile to receive your exclusive{" "}
          <span className="text-amber-500 font-medium">Beta Pioneer</span> badge
        </p>
      </div>
    </div>
  );
}