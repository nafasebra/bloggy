import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import { registerAndLogin, uniqueUser, withSession } from './utils/auth';

describe('Notifications (e2e)', () => {
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

  it('creates a follow notification and supports read operations', async () => {
    const follower = await registerAndLogin(
      httpServer,
      uniqueUser('nfollower')
    );
    const target = await registerAndLogin(httpServer, uniqueUser('ntarget'));

    await request(httpServer)
      .post(`/users/${target.user._id}/follow`)
      .set(withSession(follower.sessionToken))
      .expect(200);

    const unreadBefore = await request(httpServer)
      .get('/notifications/unread-count')
      .set(withSession(target.sessionToken))
      .expect(200);
    expect(unreadBefore.body.count).toBeGreaterThanOrEqual(1);

    const listResponse = await request(httpServer)
      .get('/notifications')
      .set(withSession(target.sessionToken))
      .expect(200);
    expect(listResponse.body.notifications.length).toBeGreaterThanOrEqual(1);

    const notificationId = listResponse.body.notifications[0]._id;

    await request(httpServer)
      .put(`/notifications/${notificationId}/read`)
      .set(withSession(target.sessionToken))
      .expect(200);

    const unreadAfterOne = await request(httpServer)
      .get('/notifications/unread-count')
      .set(withSession(target.sessionToken))
      .expect(200);
    expect(unreadAfterOne.body.count).toBe(0);

    await request(httpServer)
      .post(`/users/${target.user._id}/follow`)
      .set(withSession(follower.sessionToken))
      .expect(200);

    await request(httpServer)
      .post(`/users/${target.user._id}/follow`)
      .set(withSession(follower.sessionToken))
      .expect(200);

    await request(httpServer)
      .put('/notifications/read-all')
      .set(withSession(target.sessionToken))
      .expect(200);

    const unreadAfterAll = await request(httpServer)
      .get('/notifications/unread-count')
      .set(withSession(target.sessionToken))
      .expect(200);
    expect(unreadAfterAll.body.count).toBe(0);
  });

  it('requires authentication', async () => {
    await request(httpServer).get('/notifications').expect(401);
  });
});
