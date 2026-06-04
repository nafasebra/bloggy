import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const PROXY_ENV_KEYS = [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'http_proxy',
  'https_proxy',
  'ALL_PROXY',
  'all_proxy',
];

const LOCAL_E2E_URI =
  process.env.E2E_DATABASE_URI ?? 'mongodb://127.0.0.1:27017/bloggy-e2e';

async function tryLocalMongo(uri: string): Promise<boolean> {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    await mongoose.disconnect();
    return true;
  } catch {
    return false;
  }
}

export default async function globalSetup() {
  process.env.JWT_SECRET = 'e2e-test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';

  if (await tryLocalMongo(LOCAL_E2E_URI)) {
    process.env.DATABASE_URI = LOCAL_E2E_URI;
    return;
  }

  const savedProxyEnv: Record<string, string | undefined> = {};
  for (const key of PROXY_ENV_KEYS) {
    savedProxyEnv[key] = process.env[key];
    delete process.env[key];
  }

  let mongod: MongoMemoryServer;
  try {
    mongod = await MongoMemoryServer.create({
      binary: { version: '6.0.16' },
    });
  } finally {
    for (const key of PROXY_ENV_KEYS) {
      if (savedProxyEnv[key] !== undefined) {
        process.env[key] = savedProxyEnv[key];
      }
    }
  }

  process.env.DATABASE_URI = mongod.getUri();

  (
    globalThis as typeof globalThis & { __MONGOD__: MongoMemoryServer }
  ).__MONGOD__ = mongod;
}
