// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password'];

// Add paths that should redirect to dashboard if user is already authenticated
const AUTH_PATHS = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if the path is public
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

    // For Firebase client-side auth, we can't check auth state in middleware
    // We'll only handle public routes and let the client-side handle protected routes
    if (!isPublicPath) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};