import { expect, it } from 'vitest';
import http from '@repo/http-client/dashboard';

it('uses the package client with the dashboard proxy and cookie defaults', () => {
  expect(http.getUri({ url: '/users/me' })).toBe('/api/users/me');
  expect(http.defaults.withCredentials).toBe(true);
  expect(http.defaults.timeout).toBe(10_000);
});
