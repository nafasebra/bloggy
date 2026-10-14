const { before, after, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createSqliteDataSource } = require('./utils/sqlite-data-source');

describe('SQLite in-memory test database', () => {
  let source;
  before(async () => {
    source = await createSqliteDataSource();
  });
  after(async () => {
    if (source) await source.destroy();
  });

  it('uses isolated SQLite with all entity tables', async () => {
    assert.equal(source.options.type, 'sqljs');
    assert.equal(source.entityMetadatas.length, 8);
    assert.equal(
      (await source.query('PRAGMA foreign_keys'))[0].foreign_keys,
      1
    );
  });

  it('preserves UUIDs, uniqueness, array round trips, and cascades', async () => {
    const users = source.getRepository('User');
    const user = await users.save(
      users.create({
        name: 'Jane',
        username: 'jane',
        email: 'jane@example.com',
        password: 'hash',
      })
    );
    assert.match(user._id, /^[a-f0-9-]{36}$/);
    await assert.rejects(
      users.save(
        users.create({
          name: 'Other',
          username: 'jane',
          email: 'other@example.com',
          password: 'hash',
        })
      ),
      /UNIQUE constraint failed/
    );
    const posts = source.getRepository('Post');
    const post = await posts.save(
      posts.create({
        title: 'Hello',
        content: 'Body',
        excerpt: 'Summary',
        category: 'Tech',
        tags: ['sql', 'test'],
        authorId: user._id,
        authorName: user.name,
      })
    );
    assert.deepEqual((await posts.findOneBy({ _id: post._id })).tags, [
      'sql',
      'test',
    ]);
    await users.delete({ _id: user._id });
    assert.equal(await posts.count(), 0);
  });
});
