import http from '@/lib/http';

export async function POST() {
  try {
    const response = await http.post('/auth/logout');

    const res = new Response(JSON.stringify(response.data), {
      status: response.status,
    });

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

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { error: 'Logout failed: ' + message },
      { status: 500 }
    );
  }
}
