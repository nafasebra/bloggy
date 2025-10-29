import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect routes based on authentication status
 * 
 * Authentication Flow:
 * - Backend stores refresh_token in HTTP-only cookie
 * - Frontend uses refresh_token to get access_token via /api/refresh
 * - Access token is stored in memory (not in cookies/localStorage)
 * 
 * Route Protection Rules:
 * - Logged in users: Cannot access /auth/login, /auth/signup, /auth/forget-password
 * - Not logged in users: Cannot access /dashboard/*, /auth/change-password, /user/me
 * - Public routes: /, /blog/*, /post/*, /user/[id] (specific user profiles)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for refresh_token cookie to determine if user is logged in
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const isLoggedIn = !!refreshToken;
  
  // Routes that logged-in users should NOT access (redirect to home)
  const authRoutesForLoggedOut = [
    '/auth/login',
    '/auth/signup',
    '/auth/forget-password',
  ];
  
  // Routes that require authentication (redirect to login if not logged in)
  const protectedRoutes = [
    '/dashboard',
    '/auth/change-password',
    '/user/me',
  ];
  
  // Public routes that anyone can access
  // const publicRoutes = ['/', '/blog', '/post', '/user', '/about'];
  const privateRoutes = ['/user/me', '/blog/new'];

  // Always allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // If user is logged in and trying to access auth routes (login, signup, etc.)
  // Redirect to home page
  if (isLoggedIn && authRoutesForLoggedOut.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If user is not logged in and trying to access protected routes
  // Redirect to login page
  if (!isLoggedIn) {
    // Check exact match first for /user/me before checking /user/[id]
    if (privateRoutes.includes(pathname)) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if the pathname starts with any other protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route) && !privateRoutes.includes(pathname)
    );
    
    if (isProtectedRoute) {
      // Store the original URL to redirect back after login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
