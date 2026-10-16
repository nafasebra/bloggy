# Web architecture

The web application uses feature-based organization within the Next.js App Router.

```text
src/
  app/                     # Next.js routes, layouts, metadata, styles
    _components/           # App navigation and footer
    providers.tsx          # Client provider composition
  features/
    auth/                  # Auth screens, session helpers, provider, route handlers
    home/                  # Home screen and sections
    posts/                 # Blog, post details/editor, cards, likes, categories
    comments/              # Comment UI, queries, mutations, API types
    users/                 # Profile screens, editing, avatars, user queries
    follows/               # Follow actions, lists, counts, types
    notifications/         # Notifications and socket provider
  shared/
    components/            # Domain-independent UI
    hooks/                 # Theme hook
    lib/                   # Query keys and shared utility/integration tests
    pages/                 # Not-found and rate-limit UI
    types/                 # Generic API response types
  proxy.ts                 # Next.js request entry point for route protection
```

Features own their `pages/`, `components/`, `hooks/`, `api/`, `types.ts`, and other
domain helpers as needed. Import directly from the owning module using `@/`.
Global hook, service, and domain-type barrels have been removed to make ownership
and server/client dependencies explicit.

Route files in `app` re-export feature screens and their metadata exports. API
route files re-export the auth feature's server handlers. Layout files stay in
`app`, and `proxy.ts` stays at the Next.js entry point. Existing URLs and metadata
are preserved.

Keep `'use client'` on interactive feature modules. Import server handlers and
cookie/session server helpers only from server code; do not collect client and
server modules into a single feature barrel. A server route can render a client
feature screen without making its layout a client component.

`app` composes features. Features can use other feature modules when the workflow
requires it (for example, profile screens render posts and follower lists).
Shared code should not import from features or app composition. Domain-specific
UI such as post cards, avatars, and comment cards belongs to its owning feature,
even when several screens use it. Shared query keys keep their original values.

HTTP clients remain in `@repo/http-client/web`, reusable UI in `@repo/ui`, and
Sentry placeholders in `@repo/sentry`. No app-local infrastructure wrappers are
needed.

Place feature tests beside the modules they verify. From this directory, run
`pnpm test`, `pnpm lint`, and `pnpm build` to validate changes.
