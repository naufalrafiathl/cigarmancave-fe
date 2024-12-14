// app/api/auth/token/route.ts
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { accessToken } = await getAccessToken();
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}