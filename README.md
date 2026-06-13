# Bloggy

Full-stack blogging platform: a public blog, an admin CMS, and a shared NestJS API backed by MongoDB.

| Part | Stack | Dev URL |
|------|-------|---------|
| **Web** — public blog for readers and authors | Next.js 16, React 19 | http://localhost:3000 |
| **Dashboard** — admin CMS | Vite 7, React Router 7 | http://localhost:3001 |
| **Backend** — REST + WebSocket API | NestJS 11, Mongoose 8 | http://localhost:3030 |
| **Storybook** — UI component catalog | Storybook 10 | http://localhost:6006 |

**New here?** Follow [Quick start](#quick-start) below, then read the focused guides:

- [Frontend README](frontend/README.md) — Turborepo layout, web vs dashboard, proxies, Vitest
- [Backend README](backend/README.md) — modules, entities, Swagger, Jest unit & e2e tests

---

## What you can build with this repo

Bloggy is a learning-friendly monorepo that covers common full-stack patterns:

- **Content** — markdown posts with categories, tags, search, and read-time
- **Social** — user profiles, follow graph, likes, threaded comments
- **Realtime** — Socket.IO notifications when someone follows, likes, or comments
- **Auth** — JWT in an HTTP-only cookie, role-based admin access
- **Admin** — separate SPA for `admin` users to manage posts, users, and comments

---

## Architecture

Three clients share one API and one database. Frontends send cookies on every request (`withCredentials: true`).

```
                         ┌─────────────────────────────────────┐
                         │           MongoDB (bloggy)          │
                         │  users · posts · comments · follow  │
                         │  notifications · likes · views      │
                         └──────────────────▲──────────────────┘
                                            │ Mongoose
┌──────────────────┐  REST + cookies  ┌─────┴──────────────┐  WebSocket
│  web (3000)      │ ───────────────► │  backend (3030)    │ ◄── notifications
│  Next.js         │  /api/backend/*  │  NestJS            │
└──────────────────┘                  └─────────▲──────────┘
┌──────────────────┐  Vite proxy /api           │
│  dashboard       │ ─────────────────────────┘
│  (3001)          │
└──────────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **web** | SSR/SSG pages, auth route handlers, SEO, public UX |
| **dashboard** | Admin-only CRUD; guards on `user.role === 'admin'` |
| **backend** | Controllers → services → Mongoose schemas; Swagger at `/api` |
| **frontend/packages** | Shared UI (`@repo/ui`), HTTP client, utilities |

**Request path (web):** browser → `/api/backend/...` → Next rewrite → `http://localhost:3030/...`

**Request path (dashboard):** browser → Vite proxy `/api` → backend

Details: [frontend — How data reaches the backend](frontend/README.md#how-data-reaches-the-backend) · [backend — How data is served](backend/README.md#how-data-is-served)

---

## Repository layout

```
bloggy/
├── backend/                 # NestJS API (npm)
│   ├── src/
│   │   ├── auth/            # JWT, login, guards
│   │   ├── users/           # Profiles, avatars
│   │   ├── posts/           # Posts, views, likes
│   │   ├── comments/        # Comments, replies
│   │   ├── follow/          # Follow graph
│   │   └── notifications/   # REST + Socket.IO gateway
│   └── test/                # E2E specs (*.e2e-spec.ts)
│
├── frontend/                # Turborepo (pnpm)
│   ├── apps/
│   │   ├── web/             # Public Next.js app
│   │   ├── dashboard/       # Admin Vite SPA
│   │   └── storybook/       # Component docs
│   └── packages/
│       ├── ui/              # Design system
│       ├── http-client/     # Axios + 429 handling
│       └── shared/          # Pure utilities
│
├── docker-compose.yml       # Optional: full stack in containers
├── .env.docker.example      # Optional: Compose environment template
├── .husky/                  # Git hooks (pre-commit, commit-msg)
└── package.json             # Root: Husky, commitlint, lint-staged
```

Production **`Dockerfile`**s are also included (`backend/Dockerfile`, `frontend/Dockerfile`) — see [Docker (optional)](#docker-optional) if you prefer containers over a local install.

---

## Quick start

### Prerequisites

| Tool | Version | Used by |
|------|---------|---------|
| Node.js | 20+ recommended | everywhere |
| npm | latest | `backend/`, root hooks |
| pnpm | 9+ | `frontend/` |
| MongoDB | local, Docker, or Atlas | backend |
| Docker Desktop / Engine | latest | optional — [full stack in containers](#docker-optional) |
| Git for Windows | latest | clone, Husky hooks |

> **On Windows?** Use [Git Bash](https://git-scm.com/download/win), **PowerShell**, or **WSL**. The bash commands below work in Git Bash and WSL. PowerShell/CMD equivalents are in [Windows development](#windows-development).

### 1. Clone and install root hooks

```bash
git clone https://github.com/nafasebra/bloggy.git
cd bloggy
npm install          # enables Husky git hooks (prepare script)
```

### 2. Start MongoDB

**Option A — Docker (macOS, Linux, Windows with Docker Desktop)**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B — Local install**

Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) or use [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (includes a local server option). Default connection:

```
mongodb://localhost:27017/bloggy
```

**Option C — MongoDB Atlas**

Create a free cluster and set `DATABASE_URI` in `backend/.env` to your Atlas connection string.

The backend connects to `localhost:27017` by default when `DATABASE_URI` is unset.
### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit JWT_SECRET and DATABASE_URI
npm run start:dev
```

Backend runs at **http://localhost:3030**. Swagger UI: **http://localhost:3030/api**

> The app reads **`DATABASE_URI`**, not `MONGODB_URI`. Set `DATABASE_URI=mongodb://localhost:27017/bloggy` in `backend/.env`.

**Backend `.env` (minimum):**

```env
DATABASE_URI=mongodb://localhost:27017/bloggy
PORT=3030
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 4. Frontend

In a **second terminal**:

```bash
cd frontend
pnpm install
```

Copy env files (see [frontend/.env.example](frontend/.env.example)):

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/dashboard/.env
# Edit JWT_SECRET so it matches backend/.env
```

Start both apps:

```bash
pnpm dev                    # web + dashboard
# or
pnpm dev --filter=web       # http://localhost:3000 only
pnpm dev --filter=dashboard # http://localhost:3001 only
```

### 5. Verify everything works

1. Open http://localhost:3000 — home page loads
2. Register a user via the web app or `POST /auth/register` in Swagger
3. Open http://localhost:3030/api — explore endpoints
4. To use the dashboard, set a user's `role` to `admin` in MongoDB, then open http://localhost:3001

---

## Docker (optional)

Prefer not to install Node.js, pnpm, or MongoDB locally? You can run the entire stack with **Docker Compose** instead of the [Quick start](#quick-start) steps above.

### Install Docker

| Platform | Install |
|----------|---------|
| **Windows / macOS** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **Linux** | [Docker Engine](https://docs.docker.com/engine/install/) + [Compose plugin](https://docs.docker.com/compose/install/linux/) |

Verify:

```bash
docker --version
docker compose version
```

On Windows, start **Docker Desktop** and wait until the engine is running before building.

### Run the full stack

From the repo root:

```bash
cp .env.docker.example .env
# Edit JWT_SECRET in .env (required — do not use the default in production)

docker compose up --build
```

First build can take several minutes (frontend monorepo + Next.js standalone). Later runs use cached layers.

| Service | URL |
|---------|-----|
| Web (public blog) | http://localhost:3000 |
| Dashboard (admin) | http://localhost:3001 |
| Backend API + Swagger | http://localhost:3030/api |

Stop containers: `docker compose down`. Add `-v` to remove MongoDB and upload volumes.

### Compose environment

Root **`.env`** (from [`.env.docker.example`](.env.docker.example)) drives build args and runtime config:

```env
JWT_SECRET=change-me-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001
VITE_API_URL=http://localhost:3030
VITE_WEB_URL=http://localhost:3000
```

| Variable | Notes |
|----------|-------|
| `JWT_SECRET` | Must match between backend and web build |
| `CORS_ORIGINS` | Comma-separated browser origins allowed by the API |
| `VITE_API_URL` | URL the **browser** uses to reach the API (not the internal `http://backend:3030` hostname) |
| `NEXT_PUBLIC_*`, `VITE_WEB_URL` | Public URLs for links and redirects |

The web container talks to the API over the Docker network (`API_URL=http://backend:3030` is set in `docker-compose.yml`). Dashboard and CORS settings must use host URLs your browser can open.

### Data persistence

Compose creates named volumes:

- **`mongodb-data`** — database files
- **`backend-uploads`** — avatar uploads under `uploads/avatars/`

### Build individual images

```bash
# Backend only
docker build -t bloggy-backend ./backend

# Next.js web
docker build -t bloggy-web --target web \
  --build-arg APP=web \
  --build-arg JWT_SECRET=your-secret \
  ./frontend

# Admin dashboard (static nginx)
docker build -t bloggy-dashboard --target dashboard \
  --build-arg APP=dashboard \
  --build-arg VITE_API_URL=http://localhost:3030 \
  ./frontend
```

### Useful commands

```bash
docker compose up -d --build   # detached
docker compose logs -f backend
docker compose ps
docker compose down
```

After the stack is up, register a user at http://localhost:3000, then set `role: admin` on that user in MongoDB to use the dashboard (same as [step 5](#5-verify-everything-works) above).

---

## Windows development

Tested on **Windows 10/11**. You can use **Git Bash** (recommended — matches the bash snippets below), **PowerShell 7+**, or **WSL 2**.

### Install tools

1. **[Node.js LTS](https://nodejs.org/)** — check `node -v` (20+).
2. **pnpm** (after Node is installed):

   ```powershell
   corepack enable
   corepack prepare pnpm@latest --activate
   pnpm -v
   ```

   Or: `npm install -g pnpm`

3. **[Git for Windows](https://git-scm.com/download/win)** — required for Husky hooks and Git Bash.
4. **MongoDB** — pick one:
   - **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — then run the `docker run` command from [Quick start](#2-start-mongodb).
   - **[MongoDB Community Server](https://www.mongodb.com/try/download/community)** — MSI installer; optionally install as a **Windows service** (starts on boot). Verify in PowerShell:

     ```powershell
     mongosh
     # or legacy: mongo
     ```

   - **[MongoDB Compass](https://www.mongodb.com/products/tools/compass)** — GUI to browse data and run queries; useful for setting `role: admin` on a user.
   - **MongoDB Atlas** — no local install; paste the Atlas URI into `backend/.env`.

### Shell and terminals

| Task | Git Bash / WSL | PowerShell |
|------|----------------|------------|
| Clone & npm | same as Quick start | same |
| Copy env files | `cp` (below) | `Copy-Item` (below) |
| Run backend + frontend | two tabs in [Windows Terminal](https://aka.ms/terminal) | same |

Open **two terminals** at the repo root — one for `backend/` (`npm run start:dev`), one for `frontend/` (`pnpm dev`).

### Copy environment files (PowerShell)

From `backend/`:

```powershell
Copy-Item .env.example .env
```

From `frontend/`:

```powershell
Copy-Item .env.example apps\web\.env.local
Copy-Item .env.example apps\dashboard\.env
```

**CMD equivalent:**

```cmd
cd backend
copy .env.example .env
cd ..\frontend
copy .env.example apps\web\.env.local
copy .env.example apps\dashboard\.env
```

Edit `.env` files in VS Code or Cursor. Keep `JWT_SECRET` **identical** in `backend\.env` and `frontend\apps\web\.env.local`.

### MongoDB on Windows (without Docker)

After installing MongoDB Community Server:

- The **MongoDB** Windows service usually listens on `127.0.0.1:27017`.
- Default data directory is under `C:\Program Files\MongoDB\Server\<version>\data` (or a path chosen in the installer).
- Manage the service: **Services** app (`services.msc`) → **MongoDB Server** → Start / Restart.

Manual start (custom data path):

```powershell
mkdir C:\data\db -Force
mongod --dbpath C:\data\db
```

Set in `backend\.env`:

```env
DATABASE_URI=mongodb://127.0.0.1:27017/bloggy
```

**E2E tests** prefer `mongodb://127.0.0.1:27017/bloggy-e2e`. If MongoDB is not running, tests fall back to **mongodb-memory-server** (first run may download binaries — allow firewall/antivirus access).

### Git hooks (Husky)

From the repo root:

```powershell
npm install
```

Husky v9 sets `core.hooksPath` automatically. Hooks run via Git Bash on Windows. If hooks fail:

- Ensure Git for Windows is installed and `git` is on your `PATH`.
- Run hooks from **Git Bash** or a terminal where `sh` is available.
- Re-run `npm install` at the repo root after cloning.

Pre-commit uses `lint-staged`, which is already configured for Windows paths (see `lint-staged.config.mjs`).

### Run tests on Windows

```powershell
cd backend
npm run test
npm run test:e2e

cd ..\frontend
pnpm test
```

If e2e downloads hang behind a corporate proxy, `backend/test/global-setup.ts` temporarily clears proxy env vars while starting mongodb-memory-server.

### Common Windows issues

| Issue | Fix |
|-------|-----|
| `pnpm` not found | Run `corepack enable` or install pnpm globally |
| Port already in use (3000, 3030, …) | `netstat -ano` + `findstr :3030`, then `taskkill /PID <pid> /F` |
| Husky hook permission errors | Use Git Bash; run `npm install` at repo root |
| `EPERM` / file locks on `node_modules` | Close dev servers and editors locking files; retry install |
| Long path errors | Enable long paths: **Settings → System → For developers → Developer Mode**, or group policy `LongPathsEnabled` |
| Avatar uploads | Backend writes to `backend\uploads\avatars\` — path is created on startup |
| Cookie not sent in browser | Use `localhost` (not `127.0.0.1`) for web and API during local dev |

### Recommended VS Code / Cursor extensions

- ESLint
- Prettier
- MongoDB for VS Code (optional — inspect collections)

---

## Environment variables (cheat sheet)

Keep **`JWT_SECRET` identical** in `backend/.env` and `frontend/apps/web/.env.local`.

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URI` | backend | MongoDB connection |
| `PORT` | backend | API port (default `3030`) |
| `JWT_SECRET` | backend, web | Sign / verify session tokens |
| `JWT_EXPIRES_IN` | backend | Token lifetime (default `7d`) |
| `API_URL` | web | Backend URL for rewrites & server calls |
| `NEXT_PUBLIC_APP_URL` | web | Canonical public site URL |
| `NEXT_PUBLIC_DASHBOARD_URL` | web | Link to admin app |
| `VITE_API_URL` | dashboard | Backend URL (production) |
| `VITE_WEB_URL` | dashboard | Public site (login redirects) |
| `CORS_ORIGINS` | backend, root `.env` (optional Docker) | Allowed browser origins (comma-separated) |

Full tables: [backend README](backend/README.md#environment-variables) · [frontend README](frontend/README.md#getting-started)

---

## Common commands

### Backend (`backend/`)

```bash
npm run start:dev    # watch mode
npm run build        # compile
npm run lint         # ESLint
npm run test         # unit tests (Jest)
npm run test:e2e     # end-to-end tests
```

### Frontend (`frontend/`)

```bash
pnpm dev             # all dev apps (Turbo)
pnpm build           # production build
pnpm lint            # ESLint workspace-wide
pnpm check-types     # TypeScript
pnpm test            # Vitest (web + dashboard)
```

### Storybook

```bash
cd frontend/apps/storybook
pnpm storybook       # http://localhost:6006
```

### Docker (optional)

```bash
docker compose up --build    # full stack — see Docker (optional) section
docker compose down          # stop containers
docker compose logs -f web   # follow web logs
```

---

## Testing

| Layer | Runner | Location | Docs |
|-------|--------|----------|------|
| Backend unit | Jest | `backend/src/**/*.spec.ts` | [backend README](backend/README.md#unit-tests) |
| Backend e2e | Jest + supertest | `backend/test/*.e2e-spec.ts` | [backend README](backend/README.md#end-to-end-e2e-tests) |
| Frontend unit | Vitest | `frontend/apps/*/src/**/*.test.ts` | [frontend README](frontend/README.md#testing-vitest) |

**Backend e2e** uses a real MongoDB instance when available (`E2E_DATABASE_URI`), otherwise falls back to `mongodb-memory-server`.

**Run everything before a PR:**

```bash
cd backend && npm run test && npm run test:e2e
cd ../frontend && pnpm test
```

---

## API overview

Interactive docs: **http://localhost:3030/api** (Swagger)

| Prefix | Examples |
|--------|----------|
| `/auth` | register, login, logout, change-password |
| `/users` | profiles, avatar upload, follow/unfollow |
| `/posts` | CRUD, search, views, likes |
| `/comments` | list, create, reply, like, delete |
| `/notifications` | inbox, mark read, unread count |

Route details and entity schemas: [backend README](backend/README.md)

---

## Rate limiting

The API allows **10 requests per 60 seconds** per client (`@nestjs/throttler` in `backend/src/app.module.ts`). Over-limit responses return **HTTP 429**.

Frontends detect 429 via `@repo/http-client` and redirect to `/rate-limited`.

---

## Git hooks

Husky runs at the repo root on every clone after `npm install`:

| Hook | Action |
|------|--------|
| **pre-commit** | `lint-staged` — Prettier + ESLint on staged files |
| **commit-msg** | Conventional Commits via `commitlint` |

Run manually:

```bash
npm run lint-staged
```

Hooks live in `.husky/`. Config: `commitlint.config.cjs`, root `package.json`.

---

## Tech stack (summary)

| Area | Technologies |
|------|--------------|
| **Frontend** | Next.js 16, Vite 7, React 19, Tailwind CSS 4, TanStack Query, React Hook Form, Zod, Socket.IO client, Turborepo, pnpm |
| **Backend** | NestJS 11, Mongoose 8, Passport JWT, bcrypt, class-validator, Swagger, Socket.IO, Helmet, Multer |
| **Database** | MongoDB |
| **Testing** | Jest (backend), Vitest (frontend), supertest (e2e) |
| **Tooling** | TypeScript 5, ESLint 9, Prettier, Husky, Storybook 10 |

---

## Contributing

1. Fork and create a branch (`feature/my-change`)
2. Install dependencies and run tests (see above)
3. Use [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint
4. Open a pull request with a short summary and test plan

---

## Where to read next

| Topic | Document |
|-------|----------|
| Web vs dashboard, proxies, shared packages | [frontend/README.md](frontend/README.md) |
| NestJS modules, MongoDB collections, e2e setup | [backend/README.md](backend/README.md) |
| Windows setup (MongoDB, pnpm, hooks, troubleshooting) | [Windows development](#windows-development) |
| Optional Docker full-stack setup | [Docker (optional)](#docker-optional) |
| Swagger API reference | http://localhost:3030/api (with backend running) |

---

Made by [Nafas Ebrahimi](https://github.com/nafasebra)
