export const SESSION_COOKIE_NAME = 'session_token';

/** Non-httpOnly hint so the client can skip /users/me when logged out */
export const SESSION_HINT_COOKIE = 'session_hint';

/** Routes that require a valid session */
export const PROTECTED_ROUTE_PREFIXES = [
  '/blog/new',
  '/user/me',
  '/auth/change-password',
  '/auth/setup',
] as const;

/** Auth pages — redirect to app when already signed in */
export const AUTH_ROUTE_PREFIXES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forget-password',
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
