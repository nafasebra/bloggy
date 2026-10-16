import { createSentryOptions } from './index';

const env = (
  import.meta as ImportMeta & {
    env: {
      VITE_SENTRY_DSN?: string;
      VITE_SENTRY_ENVIRONMENT?: string;
      VITE_SENTRY_RELEASE?: string;
      MODE: string;
    };
  }
).env;

export const sentryOptions = createSentryOptions({
  dsn: env.VITE_SENTRY_DSN,
  environment: env.VITE_SENTRY_ENVIRONMENT || env.MODE,
  release: env.VITE_SENTRY_RELEASE,
});
