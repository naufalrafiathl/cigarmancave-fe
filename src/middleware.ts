import { NextResponse } from 'next/server';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import type { NextRequest } from 'next/server';

// Protect app routes
const authMiddleware = withMiddlewareAuthRequired();

export default async function middleware(request: NextRequest, event: any) {
  const { pathname } = request.nextUrl;

  // For protected routes
  if (pathname.startsWith('/app/profile')) {
    return authMiddleware(request, event);
  }

  // For Auth0 callback handling
  if (pathname.startsWith('/api/auth')) {
    // Add specific headers for Auth0 routes
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', 'https://cigarmancave.us.auth0.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since'
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/profile/:path*',
    '/api/auth/:path*'
  ],
};