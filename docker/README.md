# PostgreSQL browser UI

## Compose profiles

Run commands from the repository root. Compose reads the root `.env`; all required variables must be set, even when starting a subset of services. Use `.env.docker.example` as the template.

| Command | Services started |
| --- | --- |
| `docker compose up -d --build` | PostgreSQL and backend |
| `docker compose --profile tools up -d --build` | PostgreSQL, backend, pgAdmin |
| `docker compose --profile frontend up -d --build` | PostgreSQL, backend, web, dashboard |
| `docker compose --profile frontend --profile tools up -d --build` | All services |
| `docker compose up -d postgres pgadmin` | PostgreSQL and pgAdmin only |

Explicitly naming a profiled service starts it and its dependencies without activating the profile manually. These commands do not stop services that are already running. pgAdmin is pinned to version 9.18; upgrade the tag deliberately when needed.

## Open pgAdmin

From the repository root, run:

```sh
docker compose up -d pgadmin
```

This starts PostgreSQL and pgAdmin in Docker. Open http://localhost:5050 and sign in with `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` from the root `.env`. These initialize the account only when the pgAdmin data volume is first created.

In pgAdmin, select **Register → Server**, choose a name, and enter:

| Connection setting | Value |
| --- | --- |
| Host | `postgres` |
| Port | `5432` |
| Maintenance database | `POSTGRES_DB` from `.env` (default `bloggy`) |
| Username | `POSTGRES_USER` from `.env` (default `bloggy`) |
| Password | `POSTGRES_PASSWORD` from `.env` |

pgAdmin connects directly to PostgreSQL over the Compose network. Its login password is separate from the database password. Both its configuration and the database use persistent named volumes.

Inspect startup with `docker compose logs --tail=50 pgadmin`.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes, pull requests, and manual dispatch. It checks backend lint, TypeScript, build, unit tests, embedded PostgreSQL migration tests, and HTTP e2e tests. The frontend job checks lint, types, unit tests, and builds web, dashboard, and Storybook. After both jobs pass, a matrix builds the backend, web, and dashboard Docker images with separate layer caches. Images are not published or deployed.

CI uses Node 22 and the frontend's pinned pnpm version, installs from frozen lockfiles, and uses only disposable test credentials. No local `.env` files or production secrets are required. Runs have time limits and superseded runs on the same branch are canceled.

`compose.ci.yml` is a standalone test database, not an override of the development stack. It avoids the root Compose file's required frontend variables and profiles. PostgreSQL data lives in temporary memory-backed storage; the database uses host port 55432 and a separate project name.

To run the same backend checks locally from the repository root:

```powershell
docker compose -p bloggy-ci-local -f docker/compose.ci.yml up -d --wait
$env:E2E_DATABASE_URL="postgresql://bloggy_ci:ci-test-password@127.0.0.1:55432/bloggy_ci"
cd backend
npm ci
npm run lint:check
npm run check-types
npm run build
npm test -- --runInBand
npm run test:database
npm run test:e2e -- --runInBand
cd ..
docker compose -p bloggy-ci-local -f docker/compose.ci.yml down --volumes
Remove-Item Env:E2E_DATABASE_URL
```

The e2e harness creates an isolated schema and applies migrations before testing. CI always tears down its database and prints database logs if a step fails. For concurrent local runs, override `CI_POSTGRES_PORT` and update `E2E_DATABASE_URL` to match.
