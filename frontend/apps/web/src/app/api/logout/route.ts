import { NextResponse } from 'next/server';
import http from '@/lib/http';
import { clearSessionCookies } from '@/lib/auth/server-cookies';

export async function POST() {
  try {
    const response = await http.post('/auth/logout');

    const res = NextResponse.json(response.data, { status: response.status });
    clearSessionCookies(res);

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Logout failed: ' + message },
      { status: 500 }
    );
  }
}
