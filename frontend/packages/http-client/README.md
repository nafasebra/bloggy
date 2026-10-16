# Shared HTTP middleware

`@repo/http-client` provides Axios clients for dashboard and web. Clients send
cookies (`withCredentials: true`), use a 10-second timeout, and redirect browser
requests that receive HTTP 429 to `/rate-limited`. Server requests reject the
original error without redirecting. Authentication cookies remain HttpOnly.

Applications import ready-to-use singleton clients directly. There are no
app-level `lib/http.ts` wrappers.

```ts
// Dashboard services, hooks, and components:
import http from '@repo/http-client/dashboard';

// Web services, hooks, components, and API routes:
import http, { appHttp, serverGet, serverPost } from '@repo/http-client/web';

await http.get('/posts');
// Web only: calls Next.js routes rather than the backend proxy.
await appHttp.post('/api/login', { username, password });
```

Dashboard uses `/api` in Vite development and `VITE_API_URL` (default
`http://localhost:3030`) in production. Web uses `/api/backend` in the browser and
`API_URL` (default `http://localhost:3030`) on the server. These framework-specific
entry points are separate so Vite environment handling is never bundled into Next.js.

Web's public server fetch helpers also live in the package, with no-store caching.
Server-side requests do not automatically forward the incoming user's cookies;
authenticated server routes must forward them explicitly. Next.js route protection
remains in the web app.

For additional clients or custom middleware:

```ts
import { createHttpClient, type HttpMiddleware } from '@repo/http-client';

const customMiddleware: HttpMiddleware = (client) => {
  const id = client.interceptors.request.use((request) => request);
  return () => client.interceptors.request.eject(id);
};

const http = createHttpClient({ baseURL: '/api' });
```

Pass a second argument to `createHttpClient` to replace the default middleware
list. Include `attachRateLimitInterceptor` in that list to retain 429 handling.
Configuration can override the timeout or credentials default when needed.

For an existing Axios instance, call `applyHttpMiddleware(client, middlewares)`.
It returns an idempotent cleanup function that removes installed middleware in
reverse order. Middleware must return a cleanup function; if installation fails,
previously installed middleware is removed.
