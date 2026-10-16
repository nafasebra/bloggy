/** Browser placeholder only; not initialized or imported by the application. */
export const sentryClientOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  enabled: false,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
  sendDefaultPii: false,
  tracesSampleRate: 0,
};
