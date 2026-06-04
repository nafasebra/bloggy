# Bloggy backend

REST and WebSocket API for the [Bloggy](../) platform. Built with **NestJS 11** and **MongoDB**, it powers the public blog (`apps/web`) and admin dashboard (`apps/dashboard`).

Default dev URL: **http://localhost:3030**

---

## Features

| Area | Capabilities |
|------|--------------|
| **Authentication** | Register, login, logout, change password, forgot-password flow. JWT stored in an HTTP-only `session_token` cookie (also returned in the login body). |
| **Users** | List users, get profile, update own profile, upload avatar, delete own account. Roles: `user` and `admin`. |
| **Posts** | CRUD (author-only update/delete), search by title/category, list by user, IP-based view tracking, toggle likes (IP or authenticated user). |
| **Comments** | List by post, create, threaded replies, IP-based like toggle, author-only delete. |
| **Follow** | Toggle follow/unfollow, follower/following counts and lists, check follow status. |
| **Notifications** | In-app notifications for follow, like, and comment events. REST endpoints plus real-time push over Socket.IO (`/notifications` namespace). |
| **API docs** | Swagger UI at `/api`. |
| **Security** | Helmet headers, CORS for local frontends, global request validation, rate limiting (see below). |

---

## Architecture

The backend follows NestJS **modular, layered architecture**: each domain is a self-contained module with its own controller(s), service(s), DTOs, and Mongoose schemas.

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                            │
│  ThrottlerModule (rate limiting)                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     ▼                     ▼                     ▼
 DatabaseModule      AuthModule            Feature modules
 (Mongoose root)     JWT + Passport        Users, Posts, Comments,
                     Guards                Follow, Notifications
                           │
                           ▼
                    MongoDB (bloggy)
```

### Stack

| Layer | Technology |
|-------|------------|
| Framework | [NestJS 11](https://nestjs.com) (Express adapter) |
| Database | [MongoDB](https://www.mongodb.com) via [Mongoose 8](https://mongoosejs.com) / `@nestjs/mongoose` |
| Auth | `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, bcrypt |
| Validation | `class-validator`, `class-transformer` (global `ValidationPipe`) |
| Real-time | Socket.IO via `@nestjs/websockets` / `@nestjs/platform-socket.io` |
| Docs | `@nestjs/swagger` + Swagger UI |
| File uploads | Multer (avatar images → `uploads/avatars/`) |
| Security | Helmet, `@nestjs/throttler`, CORS with credentials |

### Module layout

| Module | Responsibility |
|--------|----------------|
| `DatabaseModule` | Mongoose connection (`DATABASE_URI`) |
| `AuthModule` | Registration, login, JWT strategy, guards (`JwtAuthGuard`, `AdminGuard`) |
| `UsersModule` | User CRUD and avatar upload |
| `PostsModule` | Posts, views, likes |
| `CommentsModule` | Comments and comment likes |
| `FollowModule` | Follow relationships (mounted under `/users`) |
| `NotificationsModule` | Notification persistence + WebSocket gateway |

Each request flows **Controller → Service → Mongoose model**. DTOs define and validate the HTTP contract; response shapes are documented in Swagger.

---

## How data is served

### REST API

Clients call JSON endpoints over HTTP. The global `ValidationPipe` strips unknown fields, validates input, and coerces types before handlers run.

```
┌──────────────┐   HTTP (JSON)    ┌─────────────────┐   Mongoose    ┌──────────┐
│ web (3000)   │ ───────────────► │ NestJS (3030)   │ ────────────► │ MongoDB  │
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

## Entities & collections

MongoDB stores documents in **collections** (one per Mongoose schema). Relationships use `ObjectId` references and denormalized fields where useful (e.g. `authorName` on posts).

### User

Account and profile data.

| Field | Type | Notes |
|-------|------|-------|
| `name`, `username`, `email` | string | `username` and `email` unique |
| `password` | string | bcrypt hash |
| `bio`, `avatar`, `location`, `website`, `twitter` | string? | Profile |
| `followers`, `following` | number? | Denormalized counts |
| `category` | string | User category |
| `postIds` | ObjectId[] | Ref → `Post` |
| `role` | `admin` \| `user` | Default `user` |
| `isNew` | boolean | Onboarding flag |

**Use case:** identity, authentication, profiles, author ownership checks.

### Post

Blog articles.

| Field | Type | Notes |
|-------|------|-------|
| `title`, `content`, `excerpt` | string | Body content |
| `tags`, `category` | string[] / string | Discovery & filtering |
| `authorId`, `authorName` | ObjectId / string | Ref → `User`; name denormalized |
| `views`, `likes` | number | Aggregated counters |
| `commentIds` | ObjectId[] | Ref → `Comment` |

**Use case:** create/read/update/delete posts, search, per-user feeds, view and like counts.

### Comment

Comments and replies on posts.

| Field | Type | Notes |
|-------|------|-------|
| `content` | string | Comment body |
| `postId`, `authorId` | ObjectId | Ref → `Post`, `User` |
| `authorName` | string | Denormalized |
| `parentId` | ObjectId? | Ref → `Comment` (replies) |
| `likes` | number? | Like counter |

**Use case:** discussion threads, nested replies, moderation (author delete).

### Follow

Directed follow edges between users.

| Field | Type | Notes |
|-------|------|-------|
| `followerId`, `followingId` | ObjectId | Ref → `User` |
| Unique index | `(followerId, followingId)` | Prevents duplicate follows |

**Use case:** social graph, follower/following lists and counts, follow notifications.

### Notification

In-app alerts for the recipient.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Recipient |
| `type` | `follow` \| `like` \| `comment` | Event kind |
| `relatedUserId` | ObjectId | Actor |
| `relatedPostId`, `relatedCommentId` | ObjectId? | Context |
| `read` | boolean | Read state |
| `message`, `link` | string | Display payload |

**Use case:** notification inbox, unread counts, real-time push via WebSocket.

### PostView

Deduped view records (one view per IP per post).

| Field | Type | Notes |
|-------|------|-------|
| `postId` | ObjectId | Ref → `Post` |
| `ipAddress` | string | Client IP |
| Unique index | `(postId, ipAddress)` | Prevents double-counting |

**Use case:** increment `Post.views` only on first view from a given IP.

### PostLike

Deduped post likes (by IP or authenticated user).

| Field | Type | Notes |
|-------|------|-------|
| `postId` | ObjectId | Ref → `Post` |
| `ipAddress` | string | Anonymous likes |
| `userId` | ObjectId? | Authenticated likes |
| Unique indexes | `(postId, ipAddress)`, `(postId, userId)` sparse | One like per identity |

**Use case:** toggle like state and keep `Post.likes` in sync.

### CommentLike

Deduped comment likes by IP.

| Field | Type | Notes |
|-------|------|-------|
| `commentId` | ObjectId | Ref → `Comment` |
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

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URI` | `mongodb://localhost:27017/bloggy` | MongoDB connection string |
| `PORT` | `3030` | HTTP listen port |
| `NODE_ENV` | — | `development`, `production`, or `test` |
| `JWT_SECRET` | — | Secret for signing JWTs (required) |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `COOKIE_DOMAIN` | — | Optional cookie domain (production) |
| `E2E_DATABASE_URI` | `mongodb://127.0.0.1:27017/bloggy-e2e` | Local MongoDB for e2e tests |

> **Note:** `.env.example` lists `MONGODB_URI`, but the app reads **`DATABASE_URI`** in `src/database/database.module.ts`.

---

## Run tests

### Unit tests

Unit tests live next to source files as `*.spec.ts` under `src/`. They use **Jest** and **@nestjs/testing** with mocked Mongoose models (`src/test/mongoose-mock.ts`) so services and controllers run without a real database.

```bash
npm run test          # run once
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

Unit tests focus on **business logic in isolation**: bcrypt/JWT and Mongoose are mocked; assertions target validation, error handling, and service behavior.

### End-to-end (e2e) tests

E2e tests live in `test/` as `*.e2e-spec.ts`. They boot the full `AppModule`, send real HTTP requests with **supertest**, and assert on status codes and response bodies against a real MongoDB instance.

```bash
npm run test:e2e
```

**Database setup** (`test/global-setup.ts`):

1. Prefer a local MongoDB at `E2E_DATABASE_URI` (or `mongodb://127.0.0.1:27017/bloggy-e2e`).
2. If unavailable, fall back to **mongodb-memory-server** (in-process MongoDB for CI).

Each test file clears all collections in `beforeEach` via `clearDatabase()` so suites stay independent. Tests run with `maxWorkers: 1` to avoid cross-suite DB races.

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
