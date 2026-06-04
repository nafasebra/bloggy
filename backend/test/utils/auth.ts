import * as request from 'supertest';
import { App } from 'supertest/types';

const PLACEHOLDER_MONGO_ID = '507f1f77bcf86cd799439011';

export interface TestUserCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export function toLoginCredentials(
  credentials: TestUserCredentials
): LoginCredentials {
  return {
    username: credentials.username,
    password: credentials.password,
  };
}

export function uniqueUser(prefix = 'user'): TestUserCredentials {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: 'Test User',
    username: `${prefix}_${id}`,
    email: `${prefix}_${id}@example.com`,
    password: 'password123',
  };
}

export async function registerUser(
  httpServer: App,
  credentials: TestUserCredentials = uniqueUser()
) {
  const response = await request(httpServer)
    .post('/auth/register')
    .send(credentials)
    .expect(201);

  return {
    credentials,
    user: response.body.user as {
      _id: string;
      username: string;
      email: string;
    },
  };
}

export async function loginUser(httpServer: App, login: LoginCredentials) {
  const response = await request(httpServer)
    .post('/auth/login')
    .send(login)
    .expect(201);

  return {
    sessionToken: response.body.session_token as string,
    user: response.body.user as { _id: string; username: string },
  };
}

export function withSession(sessionToken: string) {
  return { Cookie: `session_token=${sessionToken}` };
}

export async function registerAndLogin(
  httpServer: App,
  credentials: TestUserCredentials = uniqueUser()
) {
  const { user } = await registerUser(httpServer, credentials);
  const { sessionToken } = await loginUser(
    httpServer,
    toLoginCredentials(credentials)
  );
  return { credentials, user, sessionToken };
}

export { PLACEHOLDER_MONGO_ID };
