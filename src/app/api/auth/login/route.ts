import { handleLogin } from '@auth0/nextjs-auth0';
export const GET = handleLogin({
  returnTo: 'https://cigarmancave.com/app/profile',
  authorizationParams: {
    prompt: 'login',
  }
}) as any;