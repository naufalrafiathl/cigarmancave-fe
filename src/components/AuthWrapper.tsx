// components/AuthWrapper.tsx
'use client';

import SecretAuth from './SecretAuth';

interface AuthWrapperProps {
  isAuthenticated: boolean;
}

export default function AuthWrapper({ isAuthenticated }: AuthWrapperProps) {
  return <SecretAuth isAuthenticated={isAuthenticated} />;
}