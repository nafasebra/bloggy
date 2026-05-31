import { attachRateLimitInterceptor } from '@repo/http-client';
import axios from 'axios';

export function getApiBaseUrl() {
  return typeof window !== 'undefined'
    ? '/api/backend'
    : process.env.API_URL || 'http://localhost:3030';
}

function buildApiUrl(path: string, params?: Record<string, string>) {
  const url = new URL(
    path.startsWith('/') ? path.slice(1) : path,
    getApiBaseUrl()
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

/** Server-side fetch using the WHATWG URL API (avoids Node url.parse deprecation). */
export async function serverGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const response = await fetch(buildApiUrl(path, params), {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function serverPost<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

const http = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 10000,
});

if (typeof window !== 'undefined') {
  attachRateLimitInterceptor(http);
  attachRateLimitInterceptor(axios);
}

export default http;
