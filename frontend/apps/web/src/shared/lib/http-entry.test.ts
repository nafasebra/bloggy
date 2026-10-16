import { afterEach, expect, it, vi } from 'vitest';
import http, {
  appHttp,
  getApiBaseUrl,
  serverGet,
  serverPost,
} from '@repo/http-client/web';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('separates backend API calls from same-origin Next.js routes', () => {
  expect(http.getUri({ url: '/posts' })).toBe(`${getApiBaseUrl()}/posts`);
  expect(appHttp.getUri({ url: '/api/login' })).toBe('/api/login');
  expect(http.defaults.withCredentials).toBe(true);
  expect(appHttp.defaults.withCredentials).toBe(true);
});

it('uses the browser backend proxy', () => {
  vi.stubGlobal('window', {});
  expect(getApiBaseUrl()).toBe('/api/backend');
});

it('builds server URLs with query parameters and preserves API path prefixes', async () => {
  vi.stubEnv('API_URL', 'http://backend:3030/v1');
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
  vi.stubGlobal('fetch', fetch);
  await serverGet('/posts/search', { query: 'hello world' });
  expect(fetch.mock.calls[0]?.[0].toString()).toBe(
    'http://backend:3030/v1/posts/search?query=hello+world'
  );
  expect(fetch.mock.calls[0]?.[1]).toEqual({
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  await serverPost('/posts/123/view');
  expect(fetch.mock.calls[1]?.[1].method).toBe('POST');
});

it('rejects unsuccessful server requests', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
  await expect(serverGet('/posts')).rejects.toThrow('Request failed: 503');
});
