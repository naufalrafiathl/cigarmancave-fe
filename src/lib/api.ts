/* eslint-disable */
import axios from 'axios';
import { getSession } from '@auth0/nextjs-auth0';

export const getUserProfile = async () => {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: session.accessToken ? {
      Authorization: `Bearer ${session.accessToken}`
    } : {}
  });
  
  try {
    const response = await api.post('/api/auth/profile', {
      user: session.user
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        // Try to create/update the user profile
        const callbackResponse = await api.post('/api/auth/callback', {
          user: session.user
        });
        
        // Then fetch the profile again
        const retryResponse = await api.get('/api/auth/profile');
        return retryResponse.data;
      } catch (callbackError) {
        console.error("Callback error:", callbackError);
      }
    }

    // Fallback to session user data if API calls fail
    return {
      user: {
        fullName: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
        emailVerified: session.user.email_verified,
        locale: session.user.locale
      }
    };
  }
};