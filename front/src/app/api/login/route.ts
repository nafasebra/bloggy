export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    console.log(username, password)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    const res = new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Copy set-cookie headers from backend response
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (error: any) {
    return Response.json({ error: 'Login failed: ' + error.message }, { status: 500 });
  }
}
