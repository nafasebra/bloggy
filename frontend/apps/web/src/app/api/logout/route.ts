import { NextResponse } from 'next/server';
import http from '@/lib/http';
import { SESSION_HINT_COOKIE } from '@/lib/auth/constants';

export async function POST() {
  try {
    const response = await http.post('/auth/logout');

    const res = NextResponse.json(response.data, { status: response.status });

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          res.headers.append('set-cookie', cookie);
        });
      } else {
        res.headers.append('set-cookie', setCookieHeader);
      }
    }

    res.cookies.delete(SESSION_HINT_COOKIE);

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Logout failed: ' + message },
      { status: 500 }
    );
  }
}
