import http from '@/lib/http';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const response = await http.post('/auth/forget-password', { email });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };
    const status = axiosError.response?.status ?? 500;
    const message =
      axiosError.response?.data?.message ?? axiosError.message ?? 'Request failed';

    return NextResponse.json({ error: message }, { status });
  }
}
