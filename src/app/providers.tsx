// src/app/providers.tsx
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { epilogue } from './fonts/fonts';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}