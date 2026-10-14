# Bloggy Storybook

This workspace previews the shared `@repo/ui` components with Tailwind styles and light/dark themes. Stories live alongside components in `frontend/packages/ui/src/components/*.stories.tsx`.

From `frontend`:

```sh
pnpm storybook
```

Open http://localhost:6006. Storybook also starts with the monorepo's `pnpm dev` command.

Build the static catalog:

```sh
pnpm build-storybook
```

The output is `apps/storybook/storybook-static`. The regular `pnpm build` command also builds this workspace, and Turbo caches its static output.

Check configuration types:

```sh
pnpm --filter storybook check-types
```
