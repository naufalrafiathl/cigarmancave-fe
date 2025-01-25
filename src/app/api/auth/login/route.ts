import { handleLogin } from '@auth0/nextjs-auth0';
import { auth0Config } from '@/config/auth0-config';

export const GET = handleLogin({
  returnTo: 'https://cigarmancave.com/app/profile',
  authorizationParams: {
    prompt: 'login',
  },
  ...auth0Config
}) as any;