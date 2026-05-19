import http from '@/lib/http';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, username, email, password } = await request.json();

  try {
    const response = await http.post('/auth/register', {
      name,
      username,
      email,
      password,
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string; error?: string } };
      message?: string;
    };
    const status = axiosError.response?.status ?? 500;
    const message =
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error ??
      axiosError.message;

    return NextResponse.json(
      {
        error: typeof message === 'string' ? message : 'Registration failed',
      },
      { status }
    );
  }
}
