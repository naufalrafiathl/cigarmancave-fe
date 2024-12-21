import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired(
  async function middleware(req: NextRequest) {
    try {
      const res = NextResponse.next();
      const session = await getSession(req, res);
      
      const requestHeaders = new Headers(req.headers);
      
      if (session?.user) {
        requestHeaders.set('x-user-session', JSON.stringify({
          user: {
            email: session.user.email,
            name: session.user.name,
            picture: session.user.picture,
            sub: session.user.sub
          }
        }));
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware error:', error);
      
      return NextResponse.next();
    }
  }
);

export const config = {
  matcher: [
    '/profile/:path*',
  ],
};