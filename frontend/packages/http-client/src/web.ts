import { createHttpClient } from './client';

// Next.js supplies process.env in server bundles. No Node runtime import is
// needed in browser bundles, which always use the same-origin proxy.
declare const process: { env: { API_URL?: string } };

export function getApiBaseUrl(): string {
  return typeof window !== 'undefined'
    ? '/api/backend'
    : process.env.API_URL || 'http://localhost:3030';
}

function buildApiUrl(path: string, params?: Record<string, string>): URL {
  const url = new URL(
    path.replace(/^\/+/, ''),
    `${getApiBaseUrl().replace(/\/+$/, '')}/`
  );
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function serverRequest<T>(
  path: string,
  method: 'GET' | 'POST',
  params?: Record<string, string>
): Promise<T> {
  const response = await fetch(buildApiUrl(path, params), {
    method,
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

/** Public server-side reads; authenticated SSR must explicitly forward cookies. */
export function serverGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  return serverRequest<T>(path, 'GET', params);
}

export function serverPost<T>(path: string): Promise<T> {
  return serverRequest<T>(path, 'POST');
}

/** Same-origin Next.js authentication routes, separate from the backend proxy. */
export const appHttp = createHttpClient();

const http = createHttpClient({ baseURL: getApiBaseUrl() });
export default http;
