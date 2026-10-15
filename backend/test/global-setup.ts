export default function globalSetup() {
  process.env.JWT_SECRET = 'e2e-test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';
  process.env.METRICS_ENABLED = 'false';
  // The Nest provider is overridden before initialization; no PostgreSQL connection is opened.
  process.env.DATABASE_URL = 'postgresql://unused/unused';
  delete process.env.DATABASE_SCHEMA;
}
