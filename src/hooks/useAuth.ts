// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.user) {
        setState(prev => ({
          ...prev,
          user: data.user,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: 'Failed to check authentication status',
      }));
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setState(prev => ({
        ...prev,
        user: data.user,
        loading: false,
        error: null,
      }));

      // Optional: Save auth token to localStorage if you're using token-based auth
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear any stored auth data
      localStorage.removeItem('auth_token');

      setState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Logout failed',
      }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
  };
}