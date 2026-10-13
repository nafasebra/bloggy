import { randomUUID } from 'crypto';
import { Client } from 'pg';

export default async function globalSetup() {
  const url = process.env.E2E_DATABASE_URL;
  if (!url)
    throw new Error(
      'Set E2E_DATABASE_URL to a PostgreSQL database; tests use an isolated temporary schema.'
    );
  const schema = 'bloggy_e2e_' + randomUUID().replaceAll('-', '');
  const client = new Client({
    connectionString: url,
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  try {
    await client.query('CREATE SCHEMA "' + schema + '"');
  } finally {
    await client.end();
  }
  const connection = new URL(url);
  connection.searchParams.set('options', '-c search_path=' + schema);
  process.env.DATABASE_URL = connection.toString();
  process.env.DATABASE_SCHEMA = schema;
  process.env.JWT_SECRET = 'e2e-test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';
}
