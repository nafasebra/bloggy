export function getCorsOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGINS;
  if (fromEnv) {
    return fromEnv
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);
  }

  return ['http://localhost:3000', 'http://localhost:3001'];
}
