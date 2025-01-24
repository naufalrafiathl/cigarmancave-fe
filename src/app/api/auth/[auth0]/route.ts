import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    return handleAuth({
      callback: handleCallback({
        afterCallback: async (req, res, session) => {
          return session;
        },
      }),
      onError: async (err, req, res) => {
        console.error('Auth0 Error:', err);
        return Response.json(
          { error: err.message },
          { status: err.status || 500 }
        );
      },
    })(req);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const POST = GET;