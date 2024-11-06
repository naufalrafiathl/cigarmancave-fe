// src/app/api/auth/[...auth]/route.ts
import { NextRequest } from 'next/server';
import { handleAuth } from '@auth0/nextjs-auth0';


export const GET = handleAuth();