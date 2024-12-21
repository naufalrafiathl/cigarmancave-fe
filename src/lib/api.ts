import axios from 'axios';
import { getServerSideUser } from '@/utils/session';
import { getAccessToken } from '@auth0/nextjs-auth0';

export const getUserProfile = async () => {
  try {
    const session = await getServerSideUser();

    if (!session?.user) {
      console.log('No session found');
      return null;
    }

    const { accessToken } = await getAccessToken();

    console.log('Access Token available:', !!accessToken);

    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      headers: accessToken ? {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      } : {}
    });

    const response = await api.get('/api/auth/profile');
    return response.data;

  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 500) {
      try {
        const session = await getServerSideUser();
        if (!session?.user) return null;

        console.log('Attempting callback with user:', session.user.email);

        return {
          user: {
            fullName: session.user.name,
            email: session.user.email,
            picture: session.user.picture,
            emailVerified: session.user.email_verified,
            locale: session.user.locale || null
          }
        };
      } catch (callbackError) {
        console.error("Profile creation error:", callbackError);
        throw callbackError;
      }
    }

    throw error;
  }
};