import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register");

  // اگر کاربر لاگین نکرده و صفحه protected است
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // اگر کاربر لاگین کرده و رفت login
  if (token && isAuthPage) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
  ],
};
