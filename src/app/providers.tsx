// src/app/providers.tsx
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import QueryProvider from '@/providers/QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <QueryProvider>
      {children}
      </QueryProvider>
    </UserProvider>
  );
}