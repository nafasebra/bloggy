import { NextRequest, NextResponse } from 'next/server';

// /home/nafas/Projects/bloggy/front/src/middleware.ts

export async function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl;

    // // Skip middleware for public routes
    // if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/api/auth')) {
    //     return NextResponse.next();
    // }

    // // Check for access token in httpOnly cookie
    // const accessToken = request.cookies.get('accessToken')?.value;
    // const refreshToken = request.cookies.get('refreshToken')?.value;

    // if (!accessToken) {
    //     if (!refreshToken) {
    //         // No tokens, redirect to login
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }

    //     // Attempt to refresh token
    //     try {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ refreshToken }),
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             // Set new tokens in cookies
    //             const res = NextResponse.next();
    //             res.cookies.set('accessToken', data.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    //             res.cookies.set('refreshToken', data.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    //             return res;
    //         }
    //     } catch (error) {
    //         console.error('Token refresh failed:', error);
    //     }

    //     // Refresh failed, redirect to login
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }

    // User is authenticated, proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};