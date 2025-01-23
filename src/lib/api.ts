// lib/api.ts
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { config } from "@/config";

const createAPI = (accessToken?: string) => {
  const api = axios.create({
    baseURL: config.apiUrl,
    headers: accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : {}
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && 
          !originalRequest._retry && 
          !originalRequest.url?.includes('/api/auth/token')) {
        originalRequest._retry = true;

        try {
          const tokenResponse = await fetch('/api/auth/token');
          const data = await tokenResponse.json();
          
          if (!tokenResponse.ok) {
            if (data.redirectUrl) {
              window.location.href = data.redirectUrl;
            }
            return Promise.reject(error);
          }

          const { accessToken } = data;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          window.location.href = '/api/auth/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Handle 401 errors from the token endpoint
      if (error.response?.status === 401 && error.response?.data?.redirectUrl) {
        window.location.href = error.response.data.redirectUrl;
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};

export const getUserProfile = async () => {
  const session = await getSession();
  if (!session?.user) {
    window.location.href = '/api/auth/login';
    return null;
  }

  const api = createAPI(session.accessToken);

  try {
    const response = await api.get("/api/profile");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status !== 401) {
      try {
        await api.post("/api/auth/callback", {
          user: session.user,
        });
        const retryResponse = await api.get("/api/profile");
        return retryResponse.data;
      } catch (callbackError) {
        if (axios.isAxiosError(callbackError) && callbackError.response?.status === 401) {
          window.location.href = '/api/auth/login';
          return null;
        }
        console.error("Callback error:", callbackError);
      }
    }

    // If we get here and it's a 401, redirect to login
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.location.href = '/api/auth/login';
      return null;
    }

    return {
      user: {
        fullName: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
        emailVerified: session.user.email_verified,
        locale: session.user.locale,
      },
    };
  }
};