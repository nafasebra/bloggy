import { Client } from 'pg';
export default async function globalTeardown() {
  const schema = process.env.DATABASE_SCHEMA;
  if (!schema || !/^bloggy_e2e_[a-f0-9]{32}$/.test(schema))
    throw new Error('Invalid e2e schema');
  const client = new Client({ connectionString: process.env.E2E_DATABASE_URL });
  await client.connect();
  try {
    await client.query('DROP SCHEMA "' + schema + '" CASCADE');
  } finally {
    await client.end();
  }
}
