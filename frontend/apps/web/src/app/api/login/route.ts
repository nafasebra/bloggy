import http from '@/lib/http';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    console.log(username, password)

    const response = await http.post(
      '/auth/login',
      { username, password },
      { withCredentials: true }
    );

    const res = new Response(JSON.stringify(response.data), {
      status: response.status,
    });

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) =>
          res.headers.append('set-cookie', cookie),
        );
      } else {
        res.headers.append('set-cookie', setCookieHeader);
      }
    }

    return res;
  } catch (error: any) {
    console.error('LOGIN ERROR:', error.response?.data || error);
    return Response.json(
      {
        error: 'Login failed',
        detail: error.response?.data,
      },
      { status: error.response?.status || 500 },
    );
  }
}
