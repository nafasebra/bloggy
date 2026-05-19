import { jwtVerify } from 'jose';
import { SESSION_COOKIE_NAME } from './constants';

export interface SessionPayload {
  sub: string;
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export function getSessionTokenFromCookie(
  cookieHeader: string | null | undefined
): string | undefined {
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const [name, ...valueParts] = part.trim().split('=');
    if (name === SESSION_COOKIE_NAME) {
      return valueParts.join('=');
    }
  }

  return undefined;
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (typeof payload.sub !== 'string') return null;

    return {
      sub: payload.sub,
      username: typeof payload.username === 'string' ? payload.username : undefined,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: payload.role === 'admin' ? 'admin' : 'user',
    };
  } catch {
    return null;
  }
}
