import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

console.log('Middleware file loaded'); // Will show on server startup

export default withMiddlewareAuthRequired((req) => {
  console.log('Middleware executed for path:', req.nextUrl.pathname);
  return undefined;
});

export const config = {
  matcher: [
    '/app/profile/:path*',
    '/api/auth/:path*'
  ],
};