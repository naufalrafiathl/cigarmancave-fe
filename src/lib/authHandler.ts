// lib/authHandler.ts
import axios, { AxiosError } from 'axios';
import { getSession } from '@auth0/nextjs-auth0';
import { config } from '@/config';

interface AuthError {
  status: number;
  message: string;
}

class AuthHandler {
  private static instance: AuthHandler;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];

  private constructor() {}

  static getInstance(): AuthHandler {
    if (!AuthHandler.instance) {
      AuthHandler.instance = new AuthHandler();
    }
    return AuthHandler.instance;
  }

  private processQueue(error: any | null, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  async getValidToken(): Promise<string> {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw { status: 401, message: 'No access token available' };
      }
      return session.accessToken;
    } catch (error) {
      throw { status: 401, message: 'Authentication required' };
    }
  }

  async makeAuthenticatedRequest<T>(
    request: () => Promise<T>
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        // Token expired - redirect to login
        window.location.href = '/api/auth/login';
        throw { status: 401, message: 'Session expired. Please log in again.' };
      }
      throw error;
    }
  }

  createApiClient() {
    const api = axios.create({
      baseURL: config.apiUrl,
    });

    // Request interceptor
    api.interceptors.request.use(
      async (config) => {
        try {
          const token = await this.getValidToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          // Token not available - redirect to login
          window.location.href = '/api/auth/login';
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Redirect to login instead of trying to refresh
          window.location.href = '/api/auth/login';
          return Promise.reject({
            status: 401,
            message: 'Session expired. Please log in again.'
          });
        }

        return Promise.reject(error);
      }
    );

    return api;
  }
}

export const authHandler = AuthHandler.getInstance();
export const api = authHandler.createApiClient();