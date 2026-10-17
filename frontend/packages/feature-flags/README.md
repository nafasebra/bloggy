# @repo/feature-flags

Shared public boolean flag types, defaults, API reads, and React hooks for Web and
Dashboard. Flipt evaluation and credentials remain in NestJS.

- `@repo/feature-flags`: `defaultFlags`, `getFeatureFlags`, `FeatureFlagKey`, `FeatureFlags`.
- `@repo/feature-flags/react`: `useFeatureFlag` and `TestFeatureBanner`.

Pass the application's existing Axios client. React consumers need an existing
TanStack Query provider. Unknown or malformed flags are rejected rather than
coerced to booleans, and the hook defaults off on loading/failure.

See [setup and usage](../../../docs/feature-flags.md).
