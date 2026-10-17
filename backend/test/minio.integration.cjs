// Explicit integration check against a disposable/local real MinIO server.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { ConfigService } = require('@nestjs/config');
const { MinioAvatarStorage } = require('../src/storage/minio-avatar-storage');

test('MinIO stores private photos and exposes its web console', async () => {
  const endpoint = process.env.MINIO_ENDPOINT;
  assert.ok(
    endpoint,
    'Set MINIO_ENDPOINT, MINIO_ACCESS_KEY and MINIO_SECRET_KEY'
  );
  const bucket = process.env.MINIO_BUCKET || 'profile-photos';
  const storage = new MinioAvatarStorage(new ConfigService(process.env));
  const key = `${randomUUID()}-${randomUUID()}.png`;
  const photo = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGZkAAAAASUVORK5CYII=',
    'base64'
  );
  try {
    await storage.put(key, photo, 'image/png');
    const stream = await storage.get(key);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    assert.deepEqual(Buffer.concat(chunks), photo);
    const anonymous = await fetch(`${endpoint}/${bucket}/${key}`, {
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(
      anonymous.status,
      403,
      'Bucket must not allow anonymous reads'
    );
    const consoleResponse = await fetch(
      process.env.MINIO_CONSOLE_URL || 'http://localhost:9001',
      { signal: AbortSignal.timeout(5000) }
    );
    assert.equal(consoleResponse.status, 200);
    assert.match(consoleResponse.headers.get('content-type'), /text\/html/);
  } finally {
    await storage.remove(key);
  }
  await assert.rejects(storage.get(key), { status: 404 });
});
