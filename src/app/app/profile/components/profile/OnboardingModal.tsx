"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Trash2 } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { toast } from "sonner";
import { ProfileFormStep } from "./ProfileFormStep";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "To Our Beta Pioneers",
    description:
      "You're among our first members, and we couldn't be more grateful. As a thank you for being part of our early community, you'll receive an exclusive 'Beta Pioneer' badge - a permanent mark of honor that shows you were here from the beginning. Let's build something amazing together.",
    image:
      "https://mancave-uploads.s3.ap-southeast-2.amazonaws.com/onboard2.png",
  },
  {
    title: "Track Your Collection, Completely Free",
    description:
      "Create unlimited digital humidors and track as many cigars as you want - all at no cost. We believe in keeping the core features free. Plus, unlock premium features like AI-powered cigar insights and bulk import through receipt scanning to enhance your experience even further.",
    image:
      "https://mancave-uploads.s3.ap-southeast-2.amazonaws.com/onboard1.png",
  },
  {
    title: "Share & Discover",
    description:
      "Every cigar tells a story. Share yours through reviews and get personalized insights about each cigar you try. Connect with other enthusiasts, discover hidden gems, and learn from the community's collective experience. From quick tips to in-depth discussions, you'll find it all here.",
    image:
      "https://mancave-uploads.s3.ap-southeast-2.amazonaws.com/onboard3.png",
  },
  {
    title: "Let's Get Started",
    description:
      "Time to make yourself at home! Tell us a bit about yourself - it helps others get to know you and makes connecting over shared interests easier. Every great cigar story starts with an introduction.",
    image:
      "https://mancave-uploads.s3.ap-southeast-2.amazonaws.com/onboard4.png",
  },
];

export default onboardingSteps;

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  currentProfile: {
    fullName?: string;
    location?: string;
    profileImageUrl?: string;
  };
}

export function OnboardingModal({
  isOpen,
  onComplete,
  currentProfile,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    fullName: currentProfile.fullName || "",
    location: currentProfile.location || "",
    profileImageUrl: currentProfile.profileImageUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    updateProfile,
    uploadImage,
    deleteImage,
    isUpdating,
    isUploading,
    isDeleting,
    error,
  } = useProfileOperations();

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        toast.promise(uploadImage(file), {
          loading: "Uploading image...",
          success: (result) => {
            setProfileData((prev) => ({
              ...prev,
              profileImageUrl: result.data.profileImageUrl,
            }));
            return "Profile image uploaded successfully";
          },
          error: "Failed to upload image",
        });
      } catch (error) {
        console.error("Image upload error:", error);
      }
    },
    [uploadImage]
  );

  const handleImageDelete = useCallback(async () => {
    try {
      toast.promise(deleteImage(), {
        loading: "Removing image...",
        success: () => {
          setProfileData((prev) => ({
            ...prev,
            profileImageUrl: "",
          }));
          return "Profile image removed successfully";
        },
        error: "Failed to remove image",
      });
    } catch (error) {
      console.error("Image delete error:", error);
    }
  }, [deleteImage]);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Store the API call in a variable to track its response
      const updateResponse = await updateProfile({
        fullName: profileData.fullName,
        location: profileData.location,
        profileImageUrl: profileData.profileImageUrl,
      });

      // Log the response

      // Show toast with loading state
      await toast.promise(
        // Using Promise.resolve since we already have the response
        Promise.resolve(updateResponse),
        {
          loading: "Updating profile...",
          success: (data) => {
            // Only complete and reload after successful update
            onComplete();
            window.location.reload();
            return "Welcome aboard! Your profile has been set up successfully";
          },
          error: (err) => {
            console.error("Toast error:", err);
            return "Failed to update profile";
          },
        }
      );
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 overflow-auto">
      <div className="bg-neutral-800 rounded-3xl w-full max-w-2xl mx-4 p-6 relative">
        {/* Progress indicator */}
        <div className="flex mb-4 gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentStep ? "bg-amber-500" : "bg-neutral-600"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {onboardingSteps[currentStep].title}
          </h2>

          {onboardingSteps[currentStep].image && currentStep !== 3 && (
            <div className="relative w-full h-48 mb-4">
              <Image
                src={onboardingSteps[currentStep].image}
                alt="Step illustration"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          )}

          <p className="text-neutral-300 mb-6">
            {onboardingSteps[currentStep].description}
          </p>

          {/* Profile form on last step */}
          {/* {currentStep === onboardingSteps.length - 1 && (
            <ProfileFormStep
              profileData={profileData}
              onProfileChange={setProfileData}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              isUploading={isUploading}
              isDeleting={isDeleting}
            />
          )} */}

          {/* Profile form on last step */}
          {currentStep === onboardingSteps.length - 1 && (
            <div className="flex flex-col md:flex-row md:items-center gap-6 px-4 py-6">
              {/* Left Column - Profile Image */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative w-24 h-24 group">
                  {profileData.profileImageUrl ? (
                    <>
                      <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-neutral-600 ring-offset-2 ring-offset-neutral-800">
                        <Image
                          src={profileData.profileImageUrl}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={handleImageDelete}
                        className="absolute -bottom-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-colors"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full rounded-full bg-neutral-700 flex items-center justify-center cursor-pointer hover:bg-neutral-600 transition-colors group ring-2 ring-neutral-600 ring-offset-2 ring-offset-neutral-800">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6 text-neutral-400 group-hover:text-neutral-300" />
                        <span className="text-xs text-neutral-400 group-hover:text-neutral-300">
                          Upload
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-left text-sm text-neutral-400 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-left text-sm text-neutral-400 mb-1.5 block">
                    Location
                  </label>
                  <LocationSelector
                    value={profileData.location}
                    onChange={(location) =>
                      setProfileData((prev) => ({
                        ...prev,
                        location,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-end gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 rounded-full text-neutral-300 hover:text-white"
                disabled={isLoading}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isLoading || isUpdating || isUploading || isDeleting}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Loading..."
                : currentStep === onboardingSteps.length - 1
                ? "Complete"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
