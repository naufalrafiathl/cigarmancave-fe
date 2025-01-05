"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2, X, Upload, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { useUser } from '@auth0/nextjs-auth0/client';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    fullName?: string;
    location?: string;
    profileImageUrl?: string;
    phoneNumber?: string;
  };
}

const EditProfileModal = ({ isOpen, onClose, currentProfile }: EditProfileModalProps) => {
  const { user } = useUser();
  const { 
    updateProfile, 
    uploadImage, 
    deleteImage, 
    isUpdating, 
    isUploading, 
    isDeleting 
  } = useProfileOperations();
  
  const [formData, setFormData] = useState({
    fullName: currentProfile.fullName || '',
    location: currentProfile.location || '',
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentProfile.profileImageUrl || '');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteImage();
      setProfileImage(null);
      setPreviewUrl('');
      toast.success('Profile image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete profile image');
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let profileImageUrl = currentProfile.profileImageUrl;

      // Upload new image if selected
      if (profileImage) {
        const result = await uploadImage(profileImage);
        profileImageUrl = result.data.profileImageUrl;
      }

      // Update profile data
      await updateProfile({
        ...formData,
        profileImageUrl
      });
      
      toast.success('Profile updated successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-[#2A2A2A] rounded-xl max-w-md w-full m-4 p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B9B9B9] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#363636] flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#B9B9B9]" />
                </div>
              )}
              
              <div className="absolute -bottom-2 -right-2 flex gap-2">
                <label
                  htmlFor="profile-image"
                  className="w-8 h-8 bg-[#EFA427] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#EFA427]/90 transition-colors"
                >
                  <Upload className="w-4 h-4 text-white" />
                </label>
                
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            <p className="text-sm text-[#B9B9B9]">
              Recommended: Square image, max 5MB
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full bg-[#363636] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EFA427]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-[#363636] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#EFA427]"
                placeholder="Your location"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-transparent border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isUpdating || isUploading || isDeleting}
              className="px-4 py-2 bg-[#EFA427] text-white rounded-lg hover:bg-[#EFA427]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isUpdating || isUploading || isDeleting) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                  {isUploading ? 'Uploading...' : isDeleting ? 'Deleting...' : 'Saving...'}
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;