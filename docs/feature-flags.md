# Feature flags with Flipt

Bloggy uses self-hosted **Flipt v2.13.0**. Its web dashboard manages flags, and a
NestJS adapter evaluates an allowlist of public flags. Both frontend applications
read those results through `@repo/feature-flags`, using their existing HTTP clients.
Browsers never receive Flipt credentials or access its management API.

```text
Web / Dashboard -> existing API proxy -> GET /feature-flags
                                            -> Flipt /evaluate/v1/boolean
```

## Start locally

From the repository root, with the existing root `.env` configured:

```sh
# Flipt dashboard and one-time test flag seed, without starting the applications
docker compose --profile flags up -d flipt flipt-seed

# Entire application stack plus feature flags
docker compose --profile frontend --profile flags up -d --build

# Check that the seed completed successfully (exit code 0)
docker compose logs flipt-seed
```

Open **http://localhost:8080** (or `FLIPT_PORT`). Select the `default` environment
and namespace. The boolean flag **`test-feature`** is created with its default
value **on** and no targeting rules. Both apps display a small test banner when
it evaluates true. Change the flag's default value in Flipt and save it; the
banner updates on the frontend's next poll. No app rebuild is needed.

The seed runs only when the resource is absent. It preserves changes on subsequent
runs, including an intentional off value. A named `flipt-data` volume persists
Flipt's local Git repository across container recreation. The seed is a local
development utility; it assumes the `default` namespace and unauthenticated Flipt.

If you run NestJS on the host, add these variables to `backend/.env` and restart it:

```dotenv
FLIPT_URL=http://localhost:8080
FLIPT_ENVIRONMENT=default
FLIPT_NAMESPACE=default
FLIPT_TOKEN=
```

Inside Compose, the backend defaults to `http://flipt:8080`. Host URLs and Docker
service URLs are different. No new public frontend environment variables or build
arguments are needed. To disable host evaluation, leave `FLIPT_URL` empty.

Read the backend endpoint at **http://localhost:3030/feature-flags**:

```json
{"flags":{"test-feature":true},"source":"flipt"}
```

On a missing flag, invalid response, timeout, or unavailable Flipt, the response
instead contains `false` and `source: "fallback"`. Without the optional profile,
the rest of the app still runs. Backend evaluations are cached for 5 seconds and
concurrent requests share one lookup; frontends poll every 15 seconds while
active. Allow roughly 20 seconds for a saved change to reach an active tab.

## Use from React

Inside an existing QueryClientProvider:

```tsx
import http from '@repo/http-client/web'; // dashboard uses /dashboard
import { useFeatureFlag } from '@repo/feature-flags/react';

function Example() {
  const enabled = useFeatureFlag('test-feature', http);
  return enabled ? <p>Test feature enabled</p> : null;
}
```

The hook returns `false` while loading or on request failure. The React entry is
separate from the framework-neutral `getFeatureFlags(client)` export. The current
demo uses a fixed entity ID, `bloggy-demo`, and is global rather than per-user.
The banner is integrated into Web's providers and Dashboard's App composition.

## Extend the integration

1. Create a boolean flag in Flipt and register its safe default/key in the backend
   service and `frontend/packages/feature-flags/src/index.ts`.
2. Add its evaluation to the backend allowlist and expose only the required public
   result. Backend consumers can inject `FeatureFlagsService` after importing
   `FeatureFlagsModule`.
3. Add its usage and tests beside the owning feature. Keep authorization checks
   independent of flags: a hidden UI is not access control.
4. For targeted rollouts, derive identity/context from verified backend sessions,
   scope the evaluation cache by that identity/context, and scope/reset frontend
   query caches when users change. The current global cache is intentionally only
   suitable for the global demo flag.

This local dashboard is bound to loopback and has authentication disabled. Before
deploying Flipt remotely, configure authentication, protected ingress/TLS, and
appropriate management/evaluation permissions. Set `FLIPT_TOKEN` only on the
backend, and replace the local seed workflow with controlled environment setup.

## Validation

Backend tests cover evaluations, errors, caching, token isolation, and the public
HTTP contract. Frontend tests cover defaults and response validation. CI starts
the pinned Flipt container, seeds twice, and evaluates the test flag. This smoke
test exercises the actual seed/API contract without starting PostgreSQL.

References: [Flipt quickstart](https://docs.flipt.io/v2/quickstart),
[local storage](https://docs.flipt.io/v2/configuration/storage),
[configuration](https://docs.flipt.io/v2/configuration/overview), and
[pinned release](https://github.com/flipt-io/flipt/releases/tag/v2.13.0).
