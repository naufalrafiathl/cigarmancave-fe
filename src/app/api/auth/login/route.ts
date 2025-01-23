import { handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleLogin({
  returnTo: '/app/profile',
  authorizationParams: {
    prompt: 'login',
  },
}) as any;