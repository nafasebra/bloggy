import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const SESSION_COOKIE_NAME = 'session_token';

export function getSessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    ...(!isProduction && !isTest
      ? { domain: 'localhost' }
      : process.env.COOKIE_DOMAIN
        ? { domain: process.env.COOKIE_DOMAIN }
        : {}),
  };
}
