import http from "@/lib/http";

export async function register(email: string, password: string) {
    const { data } = await http.post('/signup', { email, password }, { withCredentials: true });
    return data;
}

export async function login(email: string, password: string) {
    const { data } = await http.post('/login', { email, password }, { withCredentials: true });
    return data; // { access_token }
}

export async function refresh() {
    const { data } = await http.post('/refresh', {}, { withCredentials: true });
    return data; // { access_token }
}
