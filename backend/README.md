# Bloggy backend

REST and WebSocket API for the [Bloggy](../) platform. Built with **NestJS 11** and **PostgreSQL**, it powers the public blog (`apps/web`) and admin dashboard (`apps/dashboard`).

Default dev URL: **http://localhost:3030**

---

## Features

| Area | Capabilities |
|------|--------------|
| **Authentication** | Register, login, logout, change password, forgot-password flow. JWT is sent only in an HTTP-only `session_token` cookie; authentication response bodies contain no tokens. |
| **Users** | List users, get profile, update own profile, upload avatar, delete own account. Roles: `user` and `admin`. |
| **Posts** | CRUD (author-only update/delete), search by title/category, list by user, IP-based view tracking, toggle likes (IP or authenticated user). |
| **Comments** | List by post, create, threaded replies, IP-based like toggle, author-only delete. |
| **Follow** | Toggle follow/unfollow, follower/following counts and lists, check follow status. |
| **Notifications** | In-app notifications for follow, like, and comment events. REST endpoints plus real-time push over Socket.IO (`/notifications` namespace). |
| **API docs** | Swagger UI at `/api`. |
| **Security** | Helmet headers, CORS for local frontends, global request validation, rate limiting (see below). |

---

## Architecture

The backend follows NestJS **modular, layered architecture**: each domain is a self-contained module with its own controller(s), service(s), DTOs, and TypeORM entities.

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                            │
│  ThrottlerModule (rate limiting)                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     ▼                     ▼                     ▼
 DatabaseModule      AuthModule            Feature modules
 (TypeORM root)     JWT + Passport        Users, Posts, Comments,
                     Guards                Follow, Notifications
                           │
                           ▼
                    PostgreSQL (bloggy)
```

### Stack

| Layer | Technology |
|-------|------------|
| Framework | [NestJS 11](https://nestjs.com) (Express adapter) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [TypeORM](https://typeorm.io/) / `@nestjs/typeorm` |
| Auth | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, bcrypt |
| Validation | `class-validator`, `class-transformer` (global `ValidationPipe`) |
| Real-time | Socket.IO via `@nestjs/websockets` / `@nestjs/platform-socket.io` |
| Docs | `@nestjs/swagger` + Swagger UI |
| File uploads | Multer (avatar images → `uploads/avatars/`) |
| Security | Helmet, `@nestjs/throttler`, CORS with credentials |

### Module layout

| Module | Responsibility |
|--------|----------------|
| `DatabaseModule` | TypeORM connection (`DATABASE_URL`) |
| `AuthModule` | Registration, login, JWT strategy, guards (`JwtAuthGuard`, `AdminGuard`) |
| `UsersModule` | User CRUD and avatar upload |
| `PostsModule` | Posts, views, likes |
| `CommentsModule` | Comments and comment likes |
| `FollowModule` | Follow relationships (mounted under `/users`) |
| `NotificationsModule` | Notification persistence + WebSocket gateway |

Each request flows **Controller → Service → TypeORM repository**. DTOs define and validate the HTTP contract; response shapes are documented in Swagger.

---

## How data is served

### REST API

Clients call JSON endpoints over HTTP. The global `ValidationPipe` strips unknown fields, validates input, and coerces types before handlers run.

```
┌──────────────┐   HTTP (JSON)    ┌─────────────────┐   TypeORM    ┌──────────┐
│ web (3000)   │ ───────────────► │ NestJS (3030)   │ ────────────► │ PostgreSQL  │
│ dashboard    │   credentials  │ Controllers     │               │          │
│ (3001)       │   (cookies)    │ Services        │               │          │
└──────────────┘                  └─────────────────┘               └──────────┘
```

- **Session auth:** login sets an HTTP-only `session_token` cookie. Protected routes use `JwtAuthGuard`, which reads the cookie or `Authorization: Bearer <token>`.
- **Optional auth:** some routes (e.g. post likes) use `OptionalJwtAuthGuard` so anonymous users can interact via IP while logged-in users are tracked by user ID.
- **Static files:** avatars are served from `/uploads` (files stored under `uploads/avatars/`).
- **CORS:** `http://localhost:3000` and `http://localhost:3001` with `credentials: true`.

### WebSocket (notifications)

Authenticated clients connect to the **`/notifications`** namespace. The gateway verifies the JWT from the handshake (cookie, `Authorization` header, or `auth.token`). Events:

| Event | Direction | Purpose |
|-------|-----------|---------|
| `new-notification` | server → client | Push a new notification |
| `unread-count` | server → client | Update unread badge |
| `mark-as-read` | client → server | Acknowledge read (handled on gateway) |

### Swagger

Interactive API reference: **http://localhost:3030/api**

---

## Entities & tables

PostgreSQL stores rows in tables mapped by TypeORM entities. Relationships use UUID foreign keys. The `_id` response field and populated relation fields are retained for frontend compatibility. Reverse lists come from queries by `authorId` and `postId`, rather than stored ID arrays.

### User

Account and profile data.

| Field | Type | Notes |
|-------|------|-------|
| `name`, `username`, `email` | string | `username` and `email` unique |
| `password` | string | bcrypt hash |
| `bio`, `avatar`, `location`, `website`, `twitter` | string? | Profile |
| `followers`, `following` | number? | Denormalized counts |
| `category` | string | User category |
| `role` | `admin` \| `user` | Default `user` |
| `isNew` | boolean | Onboarding flag |

**Use case:** identity, authentication, profiles, author ownership checks.

### Post

Blog articles.

| Field | Type | Notes |
|-------|------|-------|
| `title`, `content`, `excerpt` | string | Body content |
| `tags`, `category` | string[] / string | Discovery & filtering |
| `authorId`, `authorName` | UUID / string | Ref → `User`; name denormalized |
| `views`, `likes` | number | Aggregated counters |

**Use case:** create/read/update/delete posts, search, per-user feeds, view and like counts.

### Comment

Comments and replies on posts.

| Field | Type | Notes |
|-------|------|-------|
| `content` | string | Comment body |
| `postId`, `authorId` | UUID | Ref → `Post`, `User` |
| `authorName` | string | Denormalized |
| `parentId` | UUID? | Ref → `Comment` (replies) |
| `likes` | number? | Like counter |

**Use case:** discussion threads, nested replies, moderation (author delete).

### Follow

Directed follow edges between users.

| Field | Type | Notes |
|-------|------|-------|
| `followerId`, `followingId` | UUID | Ref → `User` |
| Unique index | `(followerId, followingId)` | Prevents duplicate follows |

**Use case:** social graph, follower/following lists and counts, follow notifications.

### Notification

In-app alerts for the recipient.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | UUID | Recipient |
| `type` | `follow` \| `like` \| `comment` | Event kind |
| `relatedUserId` | UUID | Actor |
| `relatedPostId`, `relatedCommentId` | UUID? | Context |
| `read` | boolean | Read state |
| `message`, `link` | string | Display payload |

**Use case:** notification inbox, unread counts, real-time push via WebSocket.

### PostView

Deduped view records (one view per IP per post).

| Field | Type | Notes |
|-------|------|-------|
| `postId` | UUID | Ref → `Post` |
| `ipAddress` | string | Client IP |
| Unique index | `(postId, ipAddress)` | Prevents double-counting |

**Use case:** increment `Post.views` only on first view from a given IP.

### PostLike

Deduped post likes (by IP or authenticated user).

| Field | Type | Notes |
|-------|------|-------|
| `postId` | UUID | Ref → `Post` |
| `ipAddress` | string | Anonymous likes |
| `userId` | UUID? | Authenticated likes |
| Unique indexes | `(postId, ipAddress)`, `(postId, userId)` where userId is non-null | One like per identity |

**Use case:** toggle like state and keep `Post.likes` in sync.

### CommentLike

Deduped comment likes by IP.

| Field | Type | Notes |
|-------|------|-------|
| `commentId` | UUID | Ref → `Comment` |
| `ipAddress` | string | Client IP |
| Unique index | `(commentId, ipAddress)` | One like per IP |

**Use case:** toggle comment likes without inflating counts.

---

## Project setup

```bash
npm install
```

Copy environment variables (see [Environment variables](#environment-variables)), then start the server:

```bash
# development (watch mode)
npm run start:dev

# production build
npm run build
npm run start:prod
```

---

## Run the backend with Docker Compose

Use the repository-root `docker-compose.yml`. From the repository root, copy `.env.docker.example` to `.env` if needed and set `JWT_SECRET`, then run:

```powershell
docker compose up -d --build backend
docker compose logs -f backend
```

This starts PostgreSQL and builds the NestJS application using `Dockerfile`. The API is available at **http://localhost:3030**, with Swagger at **http://localhost:3030/api**. The application waits for PostgreSQL to be healthy and applies pending migrations on startup. Database files and uploaded avatars persist in named volumes.

The Compose file sets the application database hostname to `postgres`. `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT` configure the database; `PORT` sets the API's host port. Set frontend API URLs to `http://localhost:3030` when running the frontends locally.

```powershell
docker compose down
```

Stopping the stack keeps its data volumes. Use `docker compose up -d postgres` for the database alone, or `docker compose --profile frontend up -d --build` for the backend, database, web, and dashboard. Add `--profile tools` to include pgAdmin. Compose reads the root `.env`; `backend/.env` is for running NestJS locally. Alternatively, pass `--env-file .env.docker.example` to Compose commands.

For local NestJS with the Docker database, set `DATABASE_URL=postgresql://bloggy:bloggy@localhost:5433/bloggy` in `backend/.env`. The root stack exposes PostgreSQL on port 5433 by default; containers connect to `postgres:5432`.

If you previously ran the deleted backend Compose file, its database volume is separate from the root stack's volume. Existing data is not automatically transferred.

## Database migrations

Start PostgreSQL from the repository root with `docker compose up -d postgres`. The backend uses `TypeOrmModule.forRootAsync` with `ConfigService`, feature modules register entities with `TypeOrmModule.forFeature`, and services inject `Repository<Entity>` with `@InjectRepository`.

Schema synchronization is disabled. The initial migration creates eight tables, UUID primary keys, foreign keys, enum columns, and unique indexes. Pending migrations run at startup; for deployments with multiple replicas, run migrations once before starting replicas and disable `migrationsRun` in the application configuration. Like and view changes run in transactions with row locks so records and counters remain consistent. User password columns are excluded from ordinary queries.

```bash
npm run migration:run
npm run migration:generate -- src/database/migrations/DescribeChange
npm run migration:revert
```

Existing MongoDB documents are not imported. This schema uses UUIDs and requires a separate data migration with an ID mapping if historical data must be retained. Log in again after switching databases.

To grant dashboard access:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Required | PostgreSQL connection URL, e.g. `postgresql://bloggy:bloggy@localhost:5433/bloggy` |
| `PORT` | `3030` | HTTP listen port |
| `NODE_ENV` | — | `development`, `production`, or `test` |
| `JWT_SECRET` | — | Secret for signing JWTs (required) |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `COOKIE_DOMAIN` | — | Optional cookie domain (production) |

> `DATABASE_URL` is required. Copy `.env.example` to `.env` for local development.

---

## Run tests

### Unit tests

Unit tests live next to source files as `*.spec.ts` under `src/`. They use **Jest** and **@nestjs/testing** with mocked TypeORM repositories (`src/test/repository-mock.ts`) so services and controllers run without a real database.

```bash
npm run test          # unit tests
npm run test:database # SQLite schema checks
npm run test:postgres # PostgreSQL migration checks
npm run test:watch    # watch mode
npm run test:cov      # coverage report → coverage/
```

| Spec file | What it covers |
|-----------|----------------|
| `auth/auth.service.spec.ts` | Register, login, change password, forgot password |
| `users/users.service.spec.ts` | Find, update, remove, list users |
| `users/users.controller.spec.ts` | Profile update and avatar upload guards |
| `users/avatar-upload.config.spec.ts` | Multer upload options |
| `posts/posts.service.spec.ts` | Find, search, category filter, update |
| `comments/comments.service.spec.ts` | List by post, create comment |
| `follow/follow.service.spec.ts` | Toggle follow, counts, follow status |
| `follow/follow.controller.spec.ts` | Controller wiring |

Unit tests focus on **business logic in isolation**: bcrypt/JWT and TypeORM are mocked; assertions target validation, error handling, and service behavior.

### End-to-end (e2e) tests

E2e tests live in `test/` as `*.e2e-spec.ts`. They boot the full `AppModule`, send real HTTP requests with **supertest**, and assert on status codes and response bodies against an in-memory SQLite database.

```bash
npm run test:e2e
```

**Database setup**: the test harness overrides Nest's DataSource provider with an in-memory SQLite database (sql.js). It derives compatible schemas from production entity metadata, creates tables, and resets them between tests. No Docker or PostgreSQL credentials are needed.

```sh
npm run test:database
npm run test:e2e
# Separate PostgreSQL-specific migration verification:
npm run test:postgres
```

SQLite tests do not validate PostgreSQL migration SQL or row-lock behavior. Migration checks remain available separately using PGlite.

| Spec file | What it covers |
|-----------|----------------|
| `test/auth.e2e-spec.ts` | Register, login, logout, duplicate user, protected routes |
| `test/users.e2e-spec.ts` | User listing, profile, update, avatar |
| `test/posts.e2e-spec.ts` | Post CRUD, search, views, likes |
| `test/comments.e2e-spec.ts` | Comments, replies, likes, delete |
| `test/follow.e2e-spec.ts` | Follow toggle, counts, lists |
| `test/notifications.e2e-spec.ts` | Notification list, read state, unread count |

Shared helpers: `test/utils/e2e-app.ts` (app bootstrap), `test/utils/auth.ts` (register/login/session cookies).

---

## Rate limiting

The API uses [`@nestjs/throttler`](https://github.com/nestjs/throttler) to limit abusive request bursts.

| Setting | Value |
|---------|-------|
| Window (`ttl`) | 60 seconds |
| Max requests (`limit`) | 10 per window |
| Config | `src/app.module.ts` |

When the limit is exceeded, the API responds with **HTTP 429**. Frontend apps redirect users to `/rate-limited` on 429 responses (see repo root `task` file).

---

## API route map (summary)

| Prefix | Module | Examples |
|--------|--------|----------|
| `/auth` | Auth | `POST register`, `login`, `logout`, `change-password`, `forget-password` |
| `/users` | Users, Follow | `GET /`, `GET /me`, `PATCH /:id`, `POST /:id/avatar`, `POST /:id/follow`, `GET /:id/followers` |
| `/posts` | Posts | `GET /`, `GET /search`, `POST /`, `PUT /:id`, `POST /:id/view`, `POST /:id/like` |
| `/comments` | Comments | `GET /:postId`, `POST /:postId`, `PUT /reply/:postId`, `PUT /:commentId/like` |
| `/notifications` | Notifications | `GET /`, `PUT /:id/read`, `PUT /read-all`, `GET /unread-count` |

Full request/response schemas: **http://localhost:3030/api**

---

## Related docs

- [Frontend README](../frontend/README.md) — how web and dashboard connect to this API
- [NestJS documentation](https://docs.nestjs.com)
