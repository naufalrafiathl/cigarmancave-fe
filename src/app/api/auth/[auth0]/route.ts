import { NextRequest } from 'next/server';
import { handleAuth, handleLogin, handleLogout, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
    authorizationParams: {
      prompt: 'login',
    },
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
  callback: handleCallback({
    afterCallback: (_req, _res, session) => {
      return session;
    },
  }),
});

// Enable POST method for form submissions
export const POST = handleAuth();