/** Placeholder only: initialize before Nest bootstrap when the SDK is added. */
export const sentryOptions = {
  dsn: process.env.SENTRY_DSN || undefined,
  enabled: false,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE || undefined,
  sendDefaultPii: false,
  tracesSampleRate: 0,
};
