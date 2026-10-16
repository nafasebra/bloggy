import { createSentryOptions } from './index';

declare const process: {
  env: {
    SENTRY_DSN?: string;
    SENTRY_ENVIRONMENT?: string;
    SENTRY_RELEASE?: string;
    NODE_ENV?: string;
  };
};

/** Server-only configuration; do not import this entry from browser code. */
export const sentryServerOptions = createSentryOptions({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE,
});
