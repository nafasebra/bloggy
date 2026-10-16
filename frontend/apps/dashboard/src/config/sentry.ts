/** Placeholder only: pass these options to Sentry.init when the SDK is added. */
export const sentryOptions = {
  dsn: import.meta.env.VITE_SENTRY_DSN || undefined,
  enabled: false,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
  sendDefaultPii: false,
  tracesSampleRate: 0,
};
