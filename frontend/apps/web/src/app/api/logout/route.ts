import axios from "axios";

export async function POST() {
  try {
    const response = await axios.post(
      `/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    const data = response.data;

    const res = new Response(JSON.stringify(data), {
      status: response.status,
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          res.headers.append("set-cookie", cookie);
        });
      } else {
        res.headers.append("set-cookie", setCookieHeader);
      }
    }

    return res;
  } catch (error: any) {
    return Response.json(
      { error: "Logout failed: " + error.message },
      { status: 500 }
    );
  }
}
