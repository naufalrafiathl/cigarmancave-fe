// src/app/api/auth/error/route.ts
import { NextResponse } from 'next/server';

export async function GET(_: Request) {
  return NextResponse.json(
    { error: 'Authentication error' },
    { status: 401 }
  );
}