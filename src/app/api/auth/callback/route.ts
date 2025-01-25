// app/api/auth/callback/route.ts
import { handleCallback } from '@auth0/nextjs-auth0';

const auth0Config = {
  session: {
    absoluteDuration: 24 * 60 * 60,
    cookie: {
      domain: 'cigarmancave.com',
      httpOnly: true, 
      secure: true,
      sameSite: 'lax'
    }
  },
  afterCallback: (_req: any, _res: any, session: any) => {
    return {
      ...session,
      returnTo: '/app/profile'
    };
  }
};

export const GET = handleCallback(auth0Config)(null as any, null as any) as Promise<Response>;