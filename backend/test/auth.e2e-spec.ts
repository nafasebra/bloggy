import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import {
  loginUser,
  registerUser,
  toLoginCredentials,
  uniqueUser,
  withSession,
} from './utils/auth';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let httpServer: App;

  beforeAll(async () => {
    app = await createE2eApp();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await closeE2eApp(app);
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  it('registers a new user', async () => {
    const credentials = uniqueUser('register');

    const response = await request(httpServer)
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.user.username).toBe(credentials.username);
    expect(response.body.user.email).toBe(credentials.email);
  });

  it('rejects duplicate username or email', async () => {
    const credentials = uniqueUser('duplicate');
    await registerUser(httpServer, credentials);

    await request(httpServer)
      .post('/auth/register')
      .send(credentials)
      .expect(409);
  });

  it('logs in with username and password', async () => {
    const credentials = uniqueUser('login');
    await registerUser(httpServer, credentials);

    const response = await request(httpServer)
      .post('/auth/login')
      .send(toLoginCredentials(credentials))
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.session_token).toBeDefined();
    expect(response.body.user.username).toBe(credentials.username);
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('session_token=')])
    );
  });

  it('rejects login with wrong password', async () => {
    const credentials = uniqueUser('badlogin');
    await registerUser(httpServer, credentials);

    await request(httpServer)
      .post('/auth/login')
      .send({
        username: credentials.username,
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('rejects login with unknown username', async () => {
    await request(httpServer)
      .post('/auth/login')
      .send({
        username: 'unknown_user',
        password: 'password123',
      })
      .expect(401);
  });

  it('logs out and clears session cookie', async () => {
    const credentials = uniqueUser('logout');
    await registerUser(httpServer, credentials);
    const { sessionToken } = await loginUser(
      httpServer,
      toLoginCredentials(credentials)
    );

    const response = await request(httpServer)
      .post('/auth/logout')
      .set(withSession(sessionToken))
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('session_token=;')])
    );
  });

  it('changes password when authenticated', async () => {
    const credentials = uniqueUser('changepw');
    await registerUser(httpServer, credentials);
    const { sessionToken } = await loginUser(
      httpServer,
      toLoginCredentials(credentials)
    );

    await request(httpServer)
      .post('/auth/change-password')
      .set(withSession(sessionToken))
      .send({
        old_password: credentials.password,
        new_password: 'newpassword456',
      })
      .expect(201);

    await request(httpServer)
      .post('/auth/login')
      .send({
        username: credentials.username,
        password: 'newpassword456',
      })
      .expect(201);

    await request(httpServer)
      .post('/auth/login')
      .send(toLoginCredentials(credentials))
      .expect(401);
  });

  it('accepts forget-password for any email', async () => {
    const response = await request(httpServer)
      .post('/auth/forget-password')
      .send({ email: 'nobody@example.com' })
      .expect(201);

    expect(response.body.status).toBe('success');
  });
});
