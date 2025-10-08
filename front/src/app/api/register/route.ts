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
    return NextResponse.json(
      { error: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}
