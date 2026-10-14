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
