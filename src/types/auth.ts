export interface User {
    id: string;
    email: string;
    fullName?: string;
    profileImageUrl?: string;
    location?: string;
    isOnboarded?: boolean
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: Error | null;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }
  

  export interface AuthResponse {
    user: User;
    token?: string;
  }