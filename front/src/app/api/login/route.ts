import http from "@/lib/http";


export async function login(email: string, password: string) {
    const { data } = await http.post('/login', { email, password }, { withCredentials: true });
    return data; // { access_token }
}
