# Dashboard architecture

The dashboard is organized by business feature. Import paths use `@/` for `src`.

```text
src/
  app/                 # App providers, router, query client, layout, route config
  features/
    auth/              # Auth provider and protected route
    overview/          # Overview statistics
    posts/             # Post management, editor pages, table, categories
    users/             # User management
    comments/          # Comment management
  shared/
    components/        # Loading and route-error UI
    lib/               # Shared query keys and utility/integration tests
    pages/             # Rate-limit page
  tests/               # Shared test helpers and mock server
  main.tsx             # Browser entry point
```

Each business feature owns its `pages/`, `hooks/`, `api/`, and `types.ts` as needed.
Feature-specific components and constants belong inside that feature. Add tests
beside the behavior they verify; reusable test infrastructure stays in `tests/`.

`app` composes features and shared code. Features may use shared code and another
feature's domain types when needed (for example, overview statistics use post and
user types), but should not depend on app composition. Shared code must remain
independent of features and app code. Avoid global service, hook, or domain-type
barrels; import from the owning feature. Hook barrels are scoped to each feature.

Routes import page modules directly with `React.lazy`, preserving separate page
chunks. Keep domain logic out of the router. Existing URL paths and API contracts
are unchanged.

Cross-app infrastructure remains in workspace packages: HTTP clients come from
`@repo/http-client/dashboard`, UI from `@repo/ui`, and Sentry placeholders from
`@repo/sentry/dashboard`. Shared query keys retain their existing values so cache
lookups and mutation invalidation continue to agree.

From this directory, run `pnpm test`, `pnpm lint`, and `pnpm build` to validate changes.
