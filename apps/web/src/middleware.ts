import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow /admin/login and /admin/logout - pass through without auth check
  // These routes are in the (auth) route group with their own layout
  if (pathname === '/admin/login' || pathname === '/admin/logout') {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Check for auth cookie (token)
  const token = request.cookies.get('token');

  // If no token, redirect to login with next parameter
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, allow request
  // Note: We're only checking cookie presence here.
  // The API will verify the token validity on actual API calls.
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: [
    // Match all /admin routes except static files and Next.js internals
    '/admin/:path*',
  ],
};

