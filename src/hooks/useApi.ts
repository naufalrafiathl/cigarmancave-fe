// src/hooks/useApi.ts
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

interface UserProfile {
  id: number;
  email: string;
  auth0Id: string;
  emailVerified: boolean;
  fullName?: string | null;
  profileImageUrl?: string | null;
  isPremium: boolean;
  locale?: string | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileUpdateData {
  fullName?: string;
  picture?: string;
  locale?: string;
  // Add any other fields that can be updated
}

export const useApi = () => {
  const { user } = useUser();
  
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: user ? {
      Authorization: `Bearer ${user.accessToken}`
    } : {},
  });

  return {
    getProfile: () => apiClient.get<{ user: UserProfile }>('/api/auth/profile'),
    updateProfile: (data: ProfileUpdateData) => 
      apiClient.put<{ user: UserProfile }>('/api/auth/profile', data),
  };
};

// Export the types for use in other components
export type { UserProfile, ProfileUpdateData };