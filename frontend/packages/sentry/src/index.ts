export interface SentryConfiguration {
  dsn?: string;
  environment?: string;
  release?: string;
}

/** Configuration only: the SDK must be installed and initialized separately. */
export function createSentryOptions(config: SentryConfiguration = {}) {
  return {
    dsn: config.dsn || undefined,
    environment: config.environment,
    release: config.release || undefined,
    enabled: false,
    sendDefaultPii: false,
    tracesSampleRate: 0,
  };
}
