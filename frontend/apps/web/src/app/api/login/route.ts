import { NextResponse } from 'next/server';
import http from '@/lib/http';
import { SESSION_HINT_COOKIE } from '@/lib/auth/constants';

const isProduction = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await http.post('/auth/login', { username, password });

    const res = NextResponse.json(response.data, { status: response.status });

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) =>
          res.headers.append('set-cookie', cookie)
        );
      } else {
        res.headers.append('set-cookie', setCookieHeader);
      }
    }

    res.cookies.set(SESSION_HINT_COOKIE, '1', {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };
    console.error('LOGIN ERROR:', axiosError.response?.data || error);
    return NextResponse.json(
      {
        error: 'Login failed',
        detail: axiosError.response?.data,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
