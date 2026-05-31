import { NextResponse } from 'next/server';
import http from '@/lib/http';
import {
  applySessionCookies,
  extractSessionTokenFromSetCookie,
} from '@/lib/auth/server-cookies';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await http.post('/auth/login', { username, password });

    const { session_token: sessionTokenFromBody, ...clientData } =
      response.data;
    const sessionToken =
      sessionTokenFromBody ??
      extractSessionTokenFromSetCookie(response.headers['set-cookie']);

    const res = NextResponse.json(clientData, { status: response.status });

    applySessionCookies(res, sessionToken);

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
