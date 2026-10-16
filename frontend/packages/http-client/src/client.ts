import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import { applyHttpMiddleware, type HttpMiddleware } from './middleware';
import { attachRateLimitInterceptor } from './rate-limit';

/** Cookie authentication and rate-limit handling shared by both applications. */
export function createHttpClient(
  config: CreateAxiosDefaults = {},
  middlewares: readonly HttpMiddleware[] = [attachRateLimitInterceptor]
): AxiosInstance {
  const client = axios.create({
    withCredentials: true,
    timeout: 10_000,
    ...config,
  });
  applyHttpMiddleware(client, middlewares);
  return client;
}
