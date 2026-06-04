import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import { registerAndLogin, uniqueUser, withSession } from './utils/auth';

describe('Users (e2e)', () => {
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

  it('lists users and returns profile by id', async () => {
    const { user } = await registerAndLogin(httpServer, uniqueUser('listed'));

    const listResponse = await request(httpServer).get('/users').expect(200);
    expect(listResponse.body.length).toBeGreaterThanOrEqual(1);

    const profileResponse = await request(httpServer)
      .get(`/users/${user._id}`)
      .expect(200);
    expect(profileResponse.body._id).toBe(user._id);
    expect(profileResponse.body.password).toBeUndefined();
  });

  it('returns current user from /users/me', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    const meResponse = await request(httpServer)
      .get('/users/me')
      .set(withSession(sessionToken))
      .expect(200);

    expect(meResponse.body._id).toBe(user._id);
  });

  it('updates own profile', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    const updateResponse = await request(httpServer)
      .patch(`/users/${user._id}`)
      .set(withSession(sessionToken))
      .send({ bio: 'Updated bio from e2e' })
      .expect(200);

    expect(updateResponse.body.bio).toBe('Updated bio from e2e');
  });

  it('forbids updating another users profile', async () => {
    const owner = await registerAndLogin(httpServer, uniqueUser('owner'));
    const other = await registerAndLogin(httpServer, uniqueUser('intruder'));

    await request(httpServer)
      .patch(`/users/${owner.user._id}`)
      .set(withSession(other.sessionToken))
      .send({ bio: 'Not allowed' })
      .expect(403);
  });

  it('deletes own account', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    await request(httpServer)
      .delete(`/users/${user._id}`)
      .set(withSession(sessionToken))
      .expect(200);

    await request(httpServer).get(`/users/${user._id}`).expect(404);
  });
});
