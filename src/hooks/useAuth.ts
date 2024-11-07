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
      
      if (!response.ok) {
        throw new Error('Session check failed');
      }
      
      const data = await response.json();

      setState(prev => ({
        ...prev,
        user: data.user || null,
        loading: false,
      }));
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
    setState(prev => ({ ...prev, loading: true, error: null })); // Fixed typo: _error -> error

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
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Only update state if login was successful
      setState(prev => ({
        ...prev,
        user: data.user,
        loading: false,
        error: null,
      }));

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
        credentials: 'include', // Added to ensure cookies are sent
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

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