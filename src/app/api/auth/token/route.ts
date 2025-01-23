// app/api/auth/token/route.ts
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = await getAccessToken({
      refresh: true,
    });

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        code: 'not_authenticated',
        redirectUrl: '/api/auth/login'
      }, { 
        status: 401 
      });
    }

    return NextResponse.json({ 
      accessToken: accessToken.accessToken
    });

  } catch (error) {
    console.error('Token error:', error);
    
    return NextResponse.json({
      error: 'Your session has expired. Please log in again.',
      code: 'auth_error',
      redirectUrl: '/api/auth/login'
    }, { 
      status: 401 
    });
  }
}