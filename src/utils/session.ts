import { headers } from 'next/headers';

interface UserSession {
  user: {
    email: string;
    name: string;
    picture: string;
    sub: string;
    email_verified: boolean;
    updated_at: string;
    locale: string;
  };
}

export async function getServerSideUser(): Promise<UserSession | null> {
  const headersList = await headers();
  const sessionStr = headersList.get('x-user-session');
  
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr) as UserSession;
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
}