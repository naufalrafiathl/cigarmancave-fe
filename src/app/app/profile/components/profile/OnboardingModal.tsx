"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { X, Upload, Trash2 } from "lucide-react";

import { useProfileOperations } from "@/hooks/useProfileOperations";
import { toast } from "sonner";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Hey there, welcome aboard!",
    description:
      "First off, thanks for joining us! We're building something special here - a place where both newcomers and seasoned aficionados can share their cigar journey. No pretense, just genuine connections and great stories.",
    image: "/welcome-image.jpg",
  },
  {
    title: "Your Personal Cigar Journey",
    description:
      "Remember that feeling of trying your first cigar? Now you can keep track of every memorable smoke. Create your own digital humidor, log your experiences, and if you're like me when I started, learn from others along the way. And hey, if you're curious about the deeper stories behind each cigar, our premium features have got you covered.",
    image: "/features-image.jpg",
  },
  {
    title: "Join the Conversation",
    description:
      "Whether you're looking for your next favorite smoke, want to share a special moment, or just chat about cigars - this is your space. Drop a review, ask questions (trust me, we've all been beginners), and connect with folks who share your passion. Plus, earn some cool badges that show your journey from novice to know-how!",
    image: "/social-image.jpg",
  },
  {
    title: "Let's Make It Official",
    description:
      "Alright, let's get you set up! Tell us a bit about yourself - nothing fancy, just the basics. This helps others in the community get to know you better. After all, every great cigar story starts with an introduction.",
    image: "/profile-image.jpg",
  },
];

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
      console.log('Profile update response:', updateResponse);
  
      // Show toast with loading state
      await toast.promise(
        // Using Promise.resolve since we already have the response
        Promise.resolve(updateResponse),
        {
          loading: "Updating profile...",
          success: (data) => {
            console.log('Toast success data:', data);
            // Only complete and reload after successful update
            onComplete();
            window.location.reload();
            return "Welcome aboard! Your profile has been set up successfully";
          },
          error: (err) => {
            console.error('Toast error:', err);
            return "Failed to update profile";
          }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
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

          {onboardingSteps[currentStep].image && (
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
          {currentStep === onboardingSteps.length - 1 && (
            <div className="space-y-4 mb-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 group">
                  {profileData.profileImageUrl ? (
                    <>
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={profileData.profileImageUrl}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={handleImageDelete}
                        className="absolute -bottom-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full rounded-full bg-neutral-700 flex items-center justify-center cursor-pointer hover:bg-neutral-600 transition-colors group">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-neutral-300" />
                        <span className="text-xs text-neutral-400 group-hover:text-neutral-300">
                          Upload Photo
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

              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white"
              />
              <input
                type="text"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="Location"
                className="w-full px-4 py-2 bg-neutral-700 rounded-xl text-white"
              />
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
