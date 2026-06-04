import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import { registerAndLogin, uniqueUser, withSession } from './utils/auth';

describe('Follow (e2e)', () => {
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

  it('toggles follow, updates counts, and lists followers', async () => {
    const follower = await registerAndLogin(httpServer, uniqueUser('follower'));
    const target = await registerAndLogin(httpServer, uniqueUser('target'));

    const followResponse = await request(httpServer)
      .post(`/users/${target.user._id}/follow`)
      .set(withSession(follower.sessionToken))
      .expect(200);
    expect(followResponse.body.isFollowing).toBe(true);

    const followerCount = await request(httpServer)
      .get(`/users/${target.user._id}/follower-count`)
      .expect(200);
    expect(followerCount.body.count).toBe(1);

    const followingCount = await request(httpServer)
      .get(`/users/${follower.user._id}/following-count`)
      .expect(200);
    expect(followingCount.body.count).toBe(1);

    const isFollowing = await request(httpServer)
      .get(`/users/${follower.user._id}/is-following/${target.user._id}`)
      .set(withSession(follower.sessionToken))
      .expect(200);
    expect(isFollowing.body.isFollowing).toBe(true);

    const followersList = await request(httpServer)
      .get(`/users/${target.user._id}/followers`)
      .expect(200);
    expect(followersList.body.followers).toHaveLength(1);

    const followingList = await request(httpServer)
      .get(`/users/${follower.user._id}/following`)
      .expect(200);
    expect(followingList.body.following).toHaveLength(1);

    const unfollowResponse = await request(httpServer)
      .post(`/users/${target.user._id}/follow`)
      .set(withSession(follower.sessionToken))
      .expect(200);
    expect(unfollowResponse.body.isFollowing).toBe(false);
  });

  it('rejects following yourself', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    await request(httpServer)
      .post(`/users/${user._id}/follow`)
      .set(withSession(sessionToken))
      .expect(400);
  });
});
