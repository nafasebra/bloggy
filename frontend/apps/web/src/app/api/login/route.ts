import http from '@/lib/http';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await http.post('/auth/login', { username, password });

    const res = new Response(JSON.stringify(response.data), {
      status: response.status,
    });

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

    return res;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };
    console.error('LOGIN ERROR:', axiosError.response?.data || error);
    return Response.json(
      {
        error: 'Login failed',
        detail: axiosError.response?.data,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
