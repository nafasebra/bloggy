# How to start Bloggy

Choose one mode:

- **Local development:** PostgreSQL in Docker, with NestJS and the frontends running locally for hot reload.
- **Docker Compose:** build and run the applications in containers.

Commands below use PowerShell. Start from the repository root, the directory containing `docker-compose.yml`. On other shells, use equivalent file-copy commands and remove the `.cmd` suffix from Node tool commands.

## 1. Prerequisites

- Install and start Docker Desktop with Linux containers enabled.
- For local development, install Node.js **22 LTS** and pnpm **9.0.0**.

```powershell
docker compose version
node --version
corepack.cmd enable
corepack.cmd prepare pnpm@9.0.0 --activate
pnpm.cmd --version
```

Node and pnpm on the host are not required for the container-only mode.

## 2. Prepare environment files

Create the root Compose environment file if it does not already exist:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.docker.example .env }
```

Edit `.env` and set `JWT_SECRET`, database credentials, and passwords for any management tools you will use. Keep these internal and browser-facing URLs distinct:

| Setting | Default | Purpose |
| --- | --- | --- |
| `API_URL` in root `.env` | `http://backend:3030` | Web server → backend inside Docker |
| `VITE_API_URL` | `http://localhost:3030` | Browser → backend |
| `POSTGRES_PORT` | `5433` | Database port on your machine |
| `PORT` | `3030` | Backend port on your machine |

Compose reads the **root `.env`**, not the individual application env files. The file must contain all required Compose variables, even for a database-only command. The example includes them. If you change a public port, update the corresponding frontend URLs and CORS origins as well.

Existing PostgreSQL volumes retain their original users and passwords; changing `.env` does not change credentials in an initialized database.

## 3A. Local development

### Start PostgreSQL

From the repository root:

```powershell
docker compose up -d postgres
docker compose ps postgres
```

Wait for PostgreSQL to be healthy. Create the application env files without overwriting existing settings:

```powershell
if (!(Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
if (!(Test-Path frontend/apps/web/.env)) { Copy-Item frontend/apps/web/env-example frontend/apps/web/.env }
if (!(Test-Path frontend/apps/dashboard/.env)) { Copy-Item frontend/apps/dashboard/env-example frontend/apps/dashboard/.env }
```

Check these settings:

| File | Settings |
| --- | --- |
| `backend/.env` | `DATABASE_URL=postgresql://bloggy:bloggy@localhost:5433/bloggy`, `NODE_ENV=development`, `PORT=3030`, `JWT_SECRET` |
| `frontend/apps/web/.env` | `API_URL=http://localhost:3030`, the same `JWT_SECRET` as the backend, public web/dashboard URLs |
| `frontend/apps/dashboard/.env` | `VITE_API_URL=http://localhost:3030`, `VITE_WEB_URL=http://localhost:3000` |

The database URL above assumes the default root Compose credentials. Adjust it if you changed them; URL-encode special characters in credentials used in a connection URL.

### Start the backend

In a terminal at the repository root:

```powershell
cd backend
npm.cmd ci
npm.cmd run start:dev
```

NestJS applies pending PostgreSQL migrations on startup. Open **http://localhost:3030/api** for Swagger. Keep this terminal running.

### Start the frontends

In a second terminal at the repository root:

```powershell
cd frontend
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev
```

Turbo starts web, dashboard, and Storybook. To start just one workspace instead:

```powershell
pnpm.cmd --filter web dev
pnpm.cmd --filter dashboard dev
pnpm.cmd storybook
```

Use separate terminals for commands that run continuously. Stop a local dev server with **Ctrl+C**.

## 3B. Run applications in Docker

Complete the root `.env` setup, then choose a command from the repository root:

| What to run | Command |
| --- | --- |
| Database only | `docker compose up -d postgres` |
| Database and pgAdmin only | `docker compose up -d postgres pgadmin` |
| Database and backend | `docker compose up -d --build` |
| Database, backend, web, dashboard | `docker compose --profile frontend up -d --build` |
| Applications plus pgAdmin | `docker compose --profile frontend --profile tools up -d --build` |
| Applications, pgAdmin, and monitoring | `docker compose --profile frontend --profile tools --profile monitoring up -d --build` |

The first build can take several minutes. Stop locally running application servers before starting containers on the same ports. Storybook is available through the local workspace commands; it has no Compose service. k6 is invoked separately and is not started by these commands.

Inspect startup:

```powershell
docker compose --profile frontend --profile tools --profile monitoring ps
docker compose logs -f backend
docker compose logs --tail=50 postgres
```

Profile selection does not stop services that are already running. To stop the complete stack while keeping its data:

```powershell
docker compose --profile frontend --profile tools --profile monitoring --profile loadtest down
```

Do not add `--volumes` unless you intend to delete the stack's stored data. The Compose project name is `bloggy`; changing the project name can select different volumes. A database from the former backend-only Compose stack is not imported automatically.

## 4. Open the applications

| Application | Default address |
| --- | --- |
| Public website | http://localhost:3000 |
| Admin dashboard | http://localhost:3001 |
| Backend API documentation | http://localhost:3030/api |
| Storybook, when started locally | http://localhost:6006 |
| pgAdmin, when started | http://localhost:5050 |
| Grafana, when started | http://localhost:3002 |
| Prometheus, when started | http://localhost:9090 |

Register an account on the website, then log in. JWTs are delivered through an HTTP-only cookie, not the login JSON body. Use `localhost` consistently across the web, dashboard, and API during development.

For dashboard access, grant your registered user the admin role through SQL. With default database credentials:

```powershell
docker compose exec postgres psql -U bloggy -d bloggy -c "UPDATE users SET role = 'admin' WHERE email = 'you@example.com';"
```

Log out and back in so the new JWT contains the updated role. See [backend JWT authentication](../backend/README.md#jwt-authentication-flow) for cookie and production HTTPS settings.

## 5. Open database tables in pgAdmin

```powershell
docker compose up -d postgres pgadmin
```

Open http://localhost:5050 and use `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` from the root `.env`. Under **Register → Server**, choose a name and set:

| Connection setting | Value |
| --- | --- |
| Host | `postgres` |
| Port | `5432` |
| Maintenance database | `POSTGRES_DB` from `.env` |
| Username | `POSTGRES_USER` from `.env` |
| Password | `POSTGRES_PASSWORD` from `.env` |

pgAdmin uses Docker's internal hostname and port. A database client installed on your machine uses `localhost:5433` instead. PostgreSQL's port is not a browser UI. In pgAdmin, browse **Databases → bloggy → Schemas → public → Tables**, then right-click a table and select **View/Edit Data**. Substitute your configured database name if different.

## 6. Monitoring and performance tests

```powershell
docker compose --profile monitoring up -d --build
```

Open http://localhost:3002/d/bloggy-performance and log in using `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD` from the root `.env`. Backend metrics appear after Prometheus scrapes the running backend. The metrics listener is internal to Docker on port 9464.

Run a small k6 smoke test explicitly:

```powershell
docker compose run --rm -e RUN_ID=smoke-001 -e VUS=1 -e RAMP_DURATION=1s -e HOLD_DURATION=3s k6
```

See [load and stress testing](../tests/performance/README.md) for longer scenarios, thresholds, representative data, and dashboard filters. A passing smoke test does not establish production capacity.

## 7. Run backend tests without Docker

From the repository root:

```powershell
cd backend
npm.cmd ci
npm.cmd test -- --runInBand
npm.cmd run test:database
npm.cmd run test:e2e
```

Database and HTTP tests use isolated in-memory SQLite databases. Optional PostgreSQL-specific migration checks run with `npm.cmd run test:postgres` using embedded PostgreSQL. See [CI and Docker documentation](../docker/README.md#continuous-integration) for the automated checks.

## Optional feature flag dashboard

Run `docker compose --profile flags up -d flipt flipt-seed` from the repository
root, then open http://localhost:8080. The seeded `test-feature` flag controls a
demo banner in Web and Dashboard. For host-run backend setup, usage, defaults,
and credentials, see [feature flag documentation](feature-flags.md).

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Cannot connect to Docker daemon | Start Docker Desktop and wait for the Linux engine to be ready. |
| Port is already allocated | Stop the conflicting process/container or change the host port and related URLs. |
| `bloggy-postgres` name conflict | An older container already has that explicit name. Inspect it before deciding to reuse, rename, or remove it. |
| Compose reports missing variables | Run from the root and fill the root `.env`, using `.env.docker.example` as the template. |
| Database connection refused locally | Check database health and use the host port, normally 5433, in `backend/.env`. |
| Database password rejected | Check the credentials used when the volume was first initialized. |
| Login works but protected pages fail | Match backend/web runtime JWT secrets, keep hostnames consistent, and check cookie attributes and CORS. |
| Frontend env changes do not appear in Docker | Rebuild web/dashboard; public frontend variables are embedded at build time. |
| Grafana k6 panels have no data | Run k6, select the correct run ID and time range, and check Prometheus readiness. |

Further references: [main README](../README.md), [backend](../backend/README.md), [frontend](../frontend/README.md), [Docker profiles](../docker/README.md).
