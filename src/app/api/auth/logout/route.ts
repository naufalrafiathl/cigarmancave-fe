import { handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleLogout({
  returnTo: '/',
}) as (req: any, ctx: any) => Promise<Response>;

export const POST = handleLogout({
  returnTo: '/',
}) as (req: any, ctx: any) => Promise<Response>;