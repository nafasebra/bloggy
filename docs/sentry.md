# Sentry configuration placeholders

Sentry is not installed or initialized. These templates reserve configuration
for a future integration; no events, performance traces, or session replays are
sent. Setting a DSN alone does not activate reporting: every template explicitly
sets `enabled: false`.

| Application | Configuration | Environment template |
| --- | --- | --- |
| Dashboard | `frontend/apps/dashboard/src/config/sentry.ts` | `frontend/apps/dashboard/env-example` |
| Web browser | `frontend/apps/web/src/config/sentry.client.ts` | `frontend/apps/web/env-example` |
| Web server | `frontend/apps/web/src/config/sentry.server.ts` | `frontend/apps/web/env-example` |
| Backend | `backend/src/common/config/sentry.config.ts` | `backend/.env.example` |

Use separate Sentry projects/DSNs for the web, dashboard, and backend. Copy the
relevant variables into each app's local environment file when preparing setup.
Environment distinguishes development, staging, and production; release should
identify the deployed version, such as a commit SHA. Browser variables are embedded
at build time. Existing Docker builds do not yet forward these new variables.

To implement reporting later:

1. Install the official SDK for each framework: `@sentry/nextjs`,
   `@sentry/react`, and `@sentry/nestjs`.
2. Follow the SDK's current framework initialization instructions and connect the
   corresponding template. Load server environment variables before initialization.
3. Enable reporting only when a valid DSN is supplied, and configure error capture
   and framework error boundaries/handlers. Next.js browser and server initialization
   must remain separate; add Edge configuration if that runtime is used.
4. Add CI/source-map upload configuration and Docker build/runtime variables as
   needed. Store upload auth tokens in CI secrets, never in `NEXT_PUBLIC_*` or
   `VITE_*` variables.
5. Review event payloads to redact cookies, authorization headers, and sensitive
   request data. `sendDefaultPii: false` is a starting point, not full redaction.
6. Verify a deliberate test error in each deployed app before enabling reporting
   generally. Performance tracing defaults to zero in these templates.
