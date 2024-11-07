import { handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { AppRouteHandlerFnContext } from '@auth0/nextjs-auth0';

export async function GET(
  req: NextRequest,
  ctx: AppRouteHandlerFnContext
) {
  try {
    return handleCallback(req, ctx);
  } catch (error) {
    console.error('Callback error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}