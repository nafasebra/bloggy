import http from "@/lib/http";

export async function register(email: string, password: string) {
    const { data } = await http.post('/signup', { email, password });
    return data;
}

