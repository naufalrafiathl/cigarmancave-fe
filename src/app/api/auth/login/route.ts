//api/auth/login/routes.ts
import { handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleLogin({
  returnTo: '/app/profile',
  authorizationParams: {
    prompt: 'login',
    scope: 'openid profile email offline_access',
    audience: process.env.AUTH0_AUDIENCE
  }
}) as any;