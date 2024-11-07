import { handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleLogout({
  returnTo: '/',
});

export const POST = handleLogout({
  returnTo: '/',
});