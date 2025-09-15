import http from '@/lib/http';
import { cookies } from 'next/headers';

export async function refresh() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value || null;
    if(!refreshToken) {
        throw new Error('No refresh token found');
    }
    const { data } = await http.post('/auth/refresh', { refreshToken }, { withCredentials: true });
    return data; // { access_token }
}
