import { handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleLogin({
  returnTo: '/dashboard',
  authorizationParams: {
    prompt: 'login',
  },
});

export const POST = handleLogin({
  returnTo: '/dashboard',
  authorizationParams: {
    prompt: 'login',
  },
});