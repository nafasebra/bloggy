import { createSentryOptions } from './index';

declare const process: {
  env: {
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_SENTRY_ENVIRONMENT?: string;
    NEXT_PUBLIC_SENTRY_RELEASE?: string;
    NODE_ENV?: string;
  };
};

// Keep direct env references so Next.js can inline public build-time values.
export const sentryClientOptions = createSentryOptions({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
