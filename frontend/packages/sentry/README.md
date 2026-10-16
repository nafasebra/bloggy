# @repo/sentry

Shared Sentry configuration placeholders for the frontend workspace. Reporting is
disabled, even when a DSN is set. This package does not install or initialize any
Sentry SDK.

Import configuration directly from the package when implementing SDK startup:

```ts
// Vite dashboard
import { sentryOptions } from '@repo/sentry/dashboard';

// Next.js browser initialization
import { sentryClientOptions } from '@repo/sentry/web/client';

// Next.js server initialization only
import { sentryServerOptions } from '@repo/sentry/web/server';
```

Each entry reads the corresponding application's existing environment variables.
There are no per-app configuration wrappers. The root export provides
`createSentryOptions` for explicit configuration without reading environment
variables. It does not re-export platform entries, keeping server configuration
and Vite environment access out of unrelated bundles.

All options default to `enabled: false`, `sendDefaultPii: false`, and
`tracesSampleRate: 0`. Read [the setup notes](../../../docs/sentry.md) before enabling
an SDK. Environment variable templates remain in their respective applications.
