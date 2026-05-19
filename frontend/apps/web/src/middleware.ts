import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isAuthRoute,
  isProtectedRoute,
} from '@/lib/auth/constants';
import {
  getSessionTokenFromCookie,
  verifySession,
} from '@/lib/auth/session';

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = getSessionTokenFromCookie(request.headers.get('cookie'));
  const session = await verifySession(token);

  // Signed-in users should not see login/signup
  if (isAuthRoute(pathname) && session) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL(DASHBOARD_URL));
    }

    const redirectTo = request.nextUrl.searchParams.get('redirect');
    const destination = redirectTo?.startsWith('/') ? redirectTo : '/';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Protected pages require a valid session
  if (isProtectedRoute(pathname) && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and Next internals.
     * API routes are included but only auth pages / protected pages trigger logic.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
