import { NextRequest,NextResponse } from 'next/server';


//**TODO */
export async function GET(_: NextRequest) {
  try {
    const hasValidSession = false; 

    if (hasValidSession) {
      return Response.json({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'User Name'
        }
      });
    }

    return Response.json({ user: null });
  } catch (error) {
    return NextResponse.json(
      { error: 'Session check failed' }, 
      { status: 401 }
  );  }
}