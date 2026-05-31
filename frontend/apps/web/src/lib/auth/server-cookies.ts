import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, SESSION_HINT_COOKIE } from './constants';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
    ...(!isProduction ? { domain: 'localhost' } : {}),
  };
}

export function getSessionHintCookieOptions() {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
    ...(!isProduction ? { domain: 'localhost' } : {}),
  };
}

export function extractSessionTokenFromSetCookie(
  setCookieHeader: string | string[] | undefined
): string | undefined {
  if (!setCookieHeader) return undefined;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`^${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return undefined;
}

export function applySessionCookies(
  res: NextResponse,
  sessionToken: string | undefined
) {
  if (sessionToken) {
    res.cookies.set(
      SESSION_COOKIE_NAME,
      sessionToken,
      getSessionCookieOptions()
    );
  }

  res.cookies.set(SESSION_HINT_COOKIE, '1', getSessionHintCookieOptions());
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE_NAME);
  res.cookies.delete(SESSION_HINT_COOKIE);
}
