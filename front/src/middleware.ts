import { NextRequest, NextResponse } from 'next/server';

// user:
// is logged in -> uses all pages rather than login, signup and forget password
// is not logged in -> access to all pages rather than change-password
export async function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl;

    // // Check for refresh_token cookie to determine if user is logged in
    // const refreshToken = request.cookies.get('refresh_token')?.value;
    // const isLoggedIn = !!refreshToken;

    // // Routes that logged-in users should be redirected away from
    // const authRoutesForLoggedIn = ['/auth/login', '/auth/signup', '/auth/forget-password'];

    // // Routes that non-logged-in users should be redirected away from
    // const protectedAuthRoutes = ['/auth/change-password'];

    // // Public routes that don't require authentication (for non-logged-in users)
    // const publicRoutes = ['/', '/about'];

    // // If user is logged in and trying to access auth routes, redirect to home
    // if (isLoggedIn && authRoutesForLoggedIn.includes(pathname)) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    // // If user is not logged in and trying to access protected auth routes, redirect to login
    // if (!isLoggedIn && protectedAuthRoutes.includes(pathname)) {
    //     return NextResponse.redirect(new URL('/auth/login', request.url));
    // }

    // // Allow access to API routes
    // if (pathname.startsWith('/api/')) {
    //     return NextResponse.next();
    // }

    // // For non-logged-in users, allow access to auth routes
    // if (!isLoggedIn && authRoutesForLoggedIn.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // // For non-logged-in users, allow access to public routes
    // if (!isLoggedIn && publicRoutes.includes(pathname)) {
    //     return NextResponse.next();
    // }

    // // For other routes, if not logged in, redirect to login
    // if (!isLoggedIn) {
    //     return NextResponse.redirect(new URL('/auth/login', request.url));
    // }

    // // User is logged in, proceed to any other route
    // return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};