import { handleAuth } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
console.log('the AUTH0_SECRET env var is set: ', process.env.AUTH0_SECRET);
console.log('the NODE_ENV env var is set: ', process.env.NODE_ENV);
console.log('the AUTH0_CLIENT_ID env var is set: ', process.env.AUTH0_CLIENT_ID);
console.log('the AUTH0_CLIENT_SECRET env var is set: ', process.env.AUTH0_CLIENT_SECRET);
console.log('the AUTH0_BASE_URL env var is set: ', process.env.AUTH0_BASE_URL);
export const GET = handleAuth() as (request: NextRequest) => Promise<Response>;
export const POST = GET;