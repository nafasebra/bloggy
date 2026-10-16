import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, type AxiosAdapter } from 'axios';
import {
  applyHttpMiddleware,
  attachRateLimitInterceptor,
  createHttpClient,
} from '@repo/http-client';

afterEach(() => vi.unstubAllGlobals());

function failingAdapter(status: number): AxiosAdapter {
  return async (config) => {
    throw new AxiosError('Request failed', undefined, config, undefined, {
      status,
      statusText: 'Error',
      headers: {},
      config,
      data: {},
    });
  };
}

describe('shared HTTP middleware', () => {
  it('sends cookies and applies shared defaults with per-app overrides', () => {
    const client = createHttpClient({ baseURL: '/api', timeout: 500 });
    expect(client.defaults.withCredentials).toBe(true);
    expect(client.defaults.timeout).toBe(500);
    expect(client.defaults.baseURL).toBe('/api');
    expect(createHttpClient().defaults.timeout).toBe(10_000);
  });

  it('preserves errors on the server without requiring window', async () => {
    const client = createHttpClient({ adapter: failingAdapter(429) });
    await expect(client.get('/posts')).rejects.toMatchObject({
      response: { status: 429 },
    });
  });

  it('does not redirect ordinary errors and supports removing rate-limit handling', async () => {
    const assign = vi.fn();
    vi.stubGlobal('window', { location: { pathname: '/', assign } });
    const client = createHttpClient({ adapter: failingAdapter(401) }, []);
    const dispose = applyHttpMiddleware(client, [attachRateLimitInterceptor]);
    await expect(client.get('/posts')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(assign).not.toHaveBeenCalled();
    dispose();
    dispose();
    client.defaults.adapter = failingAdapter(429);
    await expect(client.get('/posts')).rejects.toMatchObject({
      response: { status: 429 },
    });
    expect(assign).not.toHaveBeenCalled();
  });

  it('redirects browser rate limits once while keeping the rejection', async () => {
    const assign = vi.fn();
    vi.stubGlobal('window', { location: { pathname: '/', assign } });
    const client = createHttpClient({ adapter: failingAdapter(429) });
    await expect(client.get('/posts')).rejects.toMatchObject({
      response: { status: 429 },
    });
    await expect(client.get('/posts')).rejects.toMatchObject({
      response: { status: 429 },
    });
    expect(assign).toHaveBeenCalledExactlyOnceWith('/rate-limited');
  });

  it('rolls back installed middleware when a later installation fails', () => {
    const cleanup = vi.fn();
    expect(() =>
      applyHttpMiddleware(createHttpClient(), [
        () => cleanup,
        () => {
          throw new Error('Installation failed');
        },
      ])
    ).toThrow('Installation failed');
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
