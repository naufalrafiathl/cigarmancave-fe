// src/lib/auth.ts
import { User } from '@auth0/auth0-react';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: Error | null;
}