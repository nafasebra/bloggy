const { before, after, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { PGlite } = require('@electric-sql/pglite');
const { pgcrypto } = require('@electric-sql/pglite/contrib/pgcrypto');
const {
  InitialSchema1791849600000,
} = require('../src/database/migrations/1791849600000-initial-schema');

describe('PostgreSQL initial migration', () => {
  let db;
  let runner;
  const migration = new InitialSchema1791849600000();

  before(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    runner = { query: sql => db.query(sql) };
    await migration.up(runner);
  });
  after(async () => {
    await db.close();
  });

  it('generates UUIDs, enforces identity uniqueness, and defaults roles', async () => {
    const result = await db.query(
      `INSERT INTO users (name, username, email, password) VALUES ('Jane', 'jane', 'jane@example.com', 'hash') RETURNING "_id", role`
    );
    assert.match(result.rows[0]._id, /^[a-f0-9-]{36}$/);
    assert.equal(result.rows[0].role, 'user');
    await assert.rejects(
      db.query(
        `INSERT INTO users (name, username, email, password) VALUES ('Jane', 'jane', 'another@example.com', 'hash')`
      ),
      { code: '23505' }
    );
  });

  it('enforces references and permits independent anonymous likes', async () => {
    await db.exec(
      `INSERT INTO posts (title, content, excerpt, category, "authorId", "authorName") SELECT 'Hello', 'Body', 'Summary', 'Tech', "_id", name FROM users`
    );
    await db.exec(`INSERT INTO post_likes ("postId", "ipAddress") SELECT "_id", '127.0.0.1' FROM posts;
      INSERT INTO post_likes ("postId", "ipAddress") SELECT "_id", '127.0.0.2' FROM posts;`);
    await assert.rejects(
      db.exec(
        `INSERT INTO post_likes ("postId", "ipAddress") SELECT "_id", '127.0.0.1' FROM posts`
      ),
      { code: '23505' }
    );
    await assert.rejects(
      db.exec(
        `INSERT INTO comments (content, "postId", "authorId", "authorName") SELECT 'Invalid', '550e8400-e29b-41d4-a716-446655440000', "_id", name FROM users`
      ),
      { code: '23503' }
    );
    await db.exec('DELETE FROM posts');
    const result = await db.query(
      'SELECT count(*)::int AS count FROM post_likes'
    );
    assert.equal(result.rows[0].count, 0);
  });

  it('can revert and reapply the schema', async () => {
    await migration.down(runner);
    await migration.up(runner);
    const result = await db.query(
      `SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    assert.equal(result.rows[0].count, 8);
  });

  it('keeps migrations isolated to the configured search path', async () => {
    await db.exec(
      'CREATE SCHEMA isolated_test; SET search_path TO isolated_test'
    );
    await migration.up(runner);
    const tables = await db.query(
      `SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'isolated_test' AND table_type = 'BASE TABLE'`
    );
    assert.equal(tables.rows[0].count, 8);
    await migration.down(runner);
    const publicTables = await db.query(
      `SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    assert.equal(publicTables.rows[0].count, 8);
  });
});
