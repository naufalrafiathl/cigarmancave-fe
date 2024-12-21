import { NextRequest, NextResponse } from 'next/server';
import { getServerSideUser } from '@/utils/session';

// Change to named export instead of default export
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSideUser();

    // If no session exists, return a 200 with null user
    if (!session?.user) {
      return NextResponse.json({ 
        user: null,
        isAuthenticated: false 
      });
    }

    // Return user data if session exists
    return NextResponse.json({
      user: {
        id: session.user.sub,
        email: session.user.email,
        name: session.user.name,
        picture: session.user.picture,
        email_verified: session.user.email_verified,
        updated_at: session.user.updated_at,
      },
      isAuthenticated: true
    });
  } catch (error) {
    console.error('[/api/auth/me] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        user: null,
        isAuthenticated: false
      },
      { status: 500 }
    );
  }
}