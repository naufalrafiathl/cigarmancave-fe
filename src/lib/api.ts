/* eslint-disable */
import axios from "axios";
import { getSession } from "@auth0/nextjs-auth0";
import { config } from "@/config";

export const getUserProfile = async () => {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }

  const api = axios.create({
    baseURL: config.apiUrl,
    headers: session.accessToken
      ? {
          Authorization: `Bearer ${session.accessToken}`,
        }
      : {},
  });

  try {
    // First attempt: try to get existing profile
    const response = await api.get("/api/profile");
    console.log("Found existing profile:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("Profile fetch error, trying callback:", error);
    try {
      // No profile found or error, try to sync/create with Auth0 data
      await api.post("/api/auth/callback", {
        user: session.user,
      });
      // After callback, try to get profile again
      const retryResponse = await api.get("/api/profile");
      return retryResponse.data;
    } catch (callbackError) {
      console.error("Callback error:", callbackError);
      // If everything fails, fallback to session data
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
  }
};