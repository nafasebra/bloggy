import http from 'k6/http';
import { check, sleep } from 'k6';

export const baseUrl = (__ENV.BASE_URL || 'http://localhost:3030').replace(/\/$/, '');

export function positiveNumber(name, fallback) {
  const value = Number(__ENV[name] || fallback);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`);
  return value;
}

export function readiness() {
  const response = http.get(`${baseUrl}/posts`, { tags: { name: 'setup /posts' }, timeout: '10s' });
  if (response.status !== 200) throw new Error(`Target is not ready: /posts returned ${response.status}`);
}

// Read-only traffic: no registration, seeded passwords, or database mutations.
export default function browse() {
  const params = { timeout: '10s' };
  const responses = http.batch([
    ['GET', `${baseUrl}/posts`, null, { ...params, tags: { name: 'GET /posts' } }],
    ['GET', `${baseUrl}/posts/search?query=technology`, null, { ...params, tags: { name: 'GET /posts/search' } }],
  ]);
  for (const response of responses) {
    check(response, {
      'status is 200': result => result.status === 200,
      'body is a JSON array': result => {
        try { return Array.isArray(result.json()); } catch { return false; }
      },
    });
  }
  sleep(positiveNumber('THINK_TIME', 1));
}
