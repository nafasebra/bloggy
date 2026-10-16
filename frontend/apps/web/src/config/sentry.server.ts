/** Server placeholder only; keep this configuration out of client imports. */
export const sentryServerOptions = {
  dsn: process.env.SENTRY_DSN || undefined,
  enabled: false,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE || undefined,
  sendDefaultPii: false,
  tracesSampleRate: 0,
};
