# Bloggy frontend

Turborepo monorepo for the Bloggy platform: the public blog (**web**), the admin panel (**dashboard**), shared UI packages, and Storybook for component docs.

## Overview

| App / package                                         | Role                                       | Default dev URL       |
| ----------------------------------------------------- | ------------------------------------------ | --------------------- |
| **web**                                               | Public-facing blog for readers and authors | http://localhost:3000 |
| **dashboard**                                         | Admin-only CMS (posts, users, comments)    | http://localhost:3001 |
| **storybook**                                         | Isolated docs for `@repo/ui` components    | http://localhost:6006 |
| **@repo/ui**                                          | Shared React components (Radix + Tailwind) | —                     |
| **@repo/http-client**                                 | Shared Axios helpers (rate-limit handling) | —                     |
| **@repo/shared**                                      | Cross-app utilities (`getReadTime`, etc.)  | —                     |
| **@repo/eslint-config** / **@repo/typescript-config** | Shared lint & TS configs                   | —                     |

Both apps talk to the same [NestJS backend](../backend) (default `http://localhost:3030`). They are separate frontends on purpose: different users, different UX, and different deployment targets.

---

## Web vs dashboard

### Web (`apps/web`)

The **public blog**. Built with **Next.js 16** (App Router).

**Audience:** readers and logged-in authors.

**Features:**

- Home, blog listing, and post detail pages
- Create and edit posts (markdown editor)
- Auth: signup, login, password reset, profile setup
- User profiles, followers / following
- Post likes, comments, read-time estimates
- Real-time notifications (Socket.IO)
- Theme toggle (light / dark)
- SEO-friendly routes and metadata

**Why Next.js here:** server rendering and route handlers for auth cookies, rewrites to the API, and a content-focused public site.

### Dashboard (`apps/dashboard`)

The **admin CMS**. Built with **Vite 7 + React Router 7** (SPA).

**Audience:** users with `role: admin` only. Non-admins are redirected to web login.

**Features:**

- Overview stats (posts, users, comments)
- CRUD for posts, users, and comments
- Markdown editor for post content
- React Query–backed lists and forms

**Why a separate SPA:** admin workflows do not need SSR; a fast client app with simple routing and a dev proxy is enough. Keeping admin out of the public Next app reduces bundle size, attack surface, and coupling.

---

## How data reaches the backend

Both apps use **Axios** with **`withCredentials: true`** so session cookies from the Nest API are sent on each request.

```
┌─────────────┐     rewrite / proxy      ┌──────────────────┐
│  web (3000) │ ──► /api/backend/* ─────►│ NestJS (3030)    │
│  Next.js    │     (next.config.js)     │ REST + WebSocket │
└─────────────┘                          └──────────────────┘
┌─────────────┐     Vite proxy
│ dashboard   │ ──► /api/* ─────────────►│ same backend     │
│ (3001)      │     (vite.config.ts)     │                  │
└─────────────┘                          └──────────────────┘
```

### Web

- **Browser:** requests go to `/api/backend/...`; Next rewrites to `API_URL` (see `apps/web/next.config.js`).
- **Server components / route handlers:** call `API_URL` directly via `fetch` or Axios (`apps/web/src/lib/http.ts`).
- **Auth:** Next route handlers (e.g. `/api/login`) proxy login to the backend and set HTTP-only session cookies.

### Dashboard

- **Dev:** Vite proxies `/api` → `VITE_API_URL` (strip `/api` prefix).
- **Prod:** Axios uses `VITE_API_URL` as `baseURL`.
- **Auth:** reads the same session cookie; `ProtectedRoute` requires `user.role === 'admin'`.

### Shared API layer

- Service modules per domain (`post.service.ts`, `user.services.ts`, etc.) wrap REST endpoints.
- **TanStack React Query** handles caching, loading state, and mutations (`hooks/query`, `hooks/mutation` in dashboard; similar patterns in web).
- **`@repo/http-client`** attaches a **429** interceptor and redirects to `/rate-limited` (see below).

---

## Tech stack

| Layer          | Web                                 | Dashboard                        | Shared                                   |
| -------------- | ----------------------------------- | -------------------------------- | ---------------------------------------- |
| Framework      | Next.js 16, React 19                | Vite 7, React Router 7, React 19 | —                                        |
| Styling        | Tailwind CSS 4, `@repo/ui`          | Tailwind CSS 4, `@repo/ui`       | `globals.css`, Radix UI                  |
| Data           | TanStack Query, Axios               | TanStack Query, Axios            | `@repo/http-client`                      |
| Forms          | React Hook Form, Zod                | React Hook Form, Zod             | —                                        |
| Realtime       | Socket.IO client                    | —                                | —                                        |
| Auth           | JWT session cookies via Next routes | Cookie + admin guard             | —                                        |
| Markdown       | react-markdown, SimpleMDE           | Same                             | `@repo/ui/markdown-*`                    |
| Monorepo       | pnpm workspaces + Turborepo         | same                             | same                                     |
| Lint / types   | ESLint 9, TypeScript 5.9            | same                             | shared configs                           |
| Component docs | —                                   | —                                | Storybook 10 + `@storybook/addon-themes` |

---

## Testing (Vitest)

Unit tests run with **[Vitest](https://vitest.dev/)** (v4). From the frontend root:

```bash
pnpm test              # all apps via Turbo
pnpm test --filter=web
pnpm test --filter=dashboard
```

Per app:

```bash
cd apps/web && pnpm test          # single run
cd apps/web && pnpm test:watch    # watch mode
```

**What we test today:** shared helpers used in both apps — e.g. `getReadTime` from `@repo/shared` and `cn` from `@repo/ui/utils` (`apps/web/src/lib/utils.test.ts`, `apps/dashboard/src/lib/utils.test.ts`).

**Config:**

- **Web:** `apps/web/vitest.config.ts` — Node environment, path alias `@/`, globals enabled.
- **Dashboard:** Vitest block inside `apps/dashboard/vite.config.ts` — same include pattern `src/**/*.{test,spec}.{ts,tsx}`.

Turbo defines a `test` task so CI can run frontend tests in parallel with backend Jest.

---

## Rate limiting (frontend)

When the API returns **429**, Axios interceptors in `@repo/http-client` redirect the user to `/rate-limited`:

- **Web:** `/rate-limited` → “Back to Bloggy” (`/`)
- **Dashboard:** `/rate-limited` → “Back to website” (`VITE_WEB_URL`)

See the root [`task`](../task) document for full backend + frontend behavior.

---

## Getting started

**Prerequisites:** Node ≥ 18, pnpm 9, backend running on port 3030.

```bash
cd frontend
pnpm install
pnpm dev                    # web + dashboard (and other dev tasks)
pnpm dev --filter=web       # public site only
pnpm dev --filter=dashboard # admin only
```

**Storybook** (UI components):

```bash
cd apps/storybook
pnpm storybook
```

**Environment variables** (see `turbo.json` `globalEnv`):

| Variable                    | Used by                 | Purpose                          |
| --------------------------- | ----------------------- | -------------------------------- |
| `API_URL`                   | web (server / rewrites) | Backend base URL                 |
| `NEXT_PUBLIC_APP_URL`       | web                     | Canonical site URL               |
| `NEXT_PUBLIC_DASHBOARD_URL` | web                     | Link to admin                    |
| `VITE_API_URL`              | dashboard               | Backend base URL (prod)          |
| `VITE_WEB_URL`              | dashboard               | Public site URL (login redirect) |
| `JWT_SECRET`                | web (session)           | Must match backend               |

---

## Common commands

```bash
pnpm build              # production build (Turbo)
pnpm lint               # ESLint across workspace
pnpm check-types        # TypeScript
pnpm format             # Prettier
```

Build or dev a single app:

```bash
pnpm build --filter=web
pnpm dev --filter=dashboard
```

---

## Repository layout

```
frontend/
├── apps/
│   ├── web/           # Next.js public blog
│   ├── dashboard/     # Vite admin SPA
│   └── storybook/     # UI component catalog
└── packages/
    ├── ui/            # Design system + *.stories.tsx
    ├── http-client/   # Axios rate-limit helper
    ├── shared/        # Shared pure utilities
    ├── eslint-config/
    └── typescript-config/
```
