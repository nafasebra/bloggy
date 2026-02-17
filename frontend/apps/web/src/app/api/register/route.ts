import { NextRequest, NextResponse } from 'next/server';
import http from '@/lib/http';

export async function POST(request: NextRequest) {
  const { name, username, email, password } = await request.json();

  try {
    const { data } = await http.post('/auth/register', {
      name,
      username,
      email,
      password,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;
    return NextResponse.json(
      { error: typeof message === 'string' ? message : 'Registration failed' },
      { status }
    );
  }
}
