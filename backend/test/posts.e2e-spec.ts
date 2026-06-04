import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import {
  PLACEHOLDER_MONGO_ID,
  registerAndLogin,
  uniqueUser,
  withSession,
} from './utils/auth';

describe('Posts (e2e)', () => {
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

  function createPostPayload(authorId: string, authorName: string) {
    return {
      title: 'E2E Test Post',
      content: 'Full post content for e2e tests.',
      excerpt: 'Short excerpt',
      category: 'Tech',
      tags: ['nestjs', 'e2e'],
      authorId,
      authorName,
      createdAt: new Date().toISOString(),
    };
  }

  it('creates, reads, updates, and deletes a post', async () => {
    const { user, sessionToken } = await registerAndLogin(
      httpServer,
      uniqueUser('author')
    );

    const createResponse = await request(httpServer)
      .post('/posts')
      .set(withSession(sessionToken))
      .send(createPostPayload(user._id, user.username ?? 'Test User'))
      .expect(201);

    const postId = createResponse.body._id;
    expect(createResponse.body.title).toBe('E2E Test Post');

    const listResponse = await request(httpServer).get('/posts').expect(200);
    expect(listResponse.body).toHaveLength(1);

    const getResponse = await request(httpServer)
      .get(`/posts/${postId}`)
      .expect(200);
    expect(getResponse.body._id).toBe(postId);

    const updateResponse = await request(httpServer)
      .put(`/posts/${postId}`)
      .set(withSession(sessionToken))
      .send({
        title: 'Updated Title',
        content: createResponse.body.content,
        excerpt: createResponse.body.excerpt,
        category: createResponse.body.category,
        tags: createResponse.body.tags,
        authorId: user._id,
        updatedAt: new Date().toISOString(),
      })
      .expect(200);
    expect(updateResponse.body.title).toBe('Updated Title');

    await request(httpServer)
      .delete(`/posts/${postId}`)
      .set(withSession(sessionToken))
      .expect(200);

    await request(httpServer).get(`/posts/${postId}`).expect(404);
  });

  it('forbids updating another users post', async () => {
    const author = await registerAndLogin(httpServer, uniqueUser('owner'));
    const other = await registerAndLogin(httpServer, uniqueUser('other'));

    const createResponse = await request(httpServer)
      .post('/posts')
      .set(withSession(author.sessionToken))
      .send(createPostPayload(author.user._id, author.user.username ?? 'Owner'))
      .expect(201);

    await request(httpServer)
      .put(`/posts/${createResponse.body._id}`)
      .set(withSession(other.sessionToken))
      .send({
        title: 'Hijacked',
        content: createResponse.body.content,
        excerpt: createResponse.body.excerpt,
        category: createResponse.body.category,
        tags: createResponse.body.tags,
        authorId: other.user._id,
        updatedAt: new Date().toISOString(),
      })
      .expect(403);
  });

  it('searches posts by query', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    await request(httpServer)
      .post('/posts')
      .set(withSession(sessionToken))
      .send({
        ...createPostPayload(user._id, 'Author'),
        title: 'UniqueSearchableTitle',
        category: 'Science',
      })
      .expect(201);

    const searchResponse = await request(httpServer)
      .get('/posts/search')
      .query({ query: 'UniqueSearchable' })
      .expect(200);

    expect(searchResponse.body.length).toBeGreaterThanOrEqual(1);
    expect(searchResponse.body[0].title).toContain('UniqueSearchable');
  });

  it('tracks post views and likes', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);

    const createResponse = await request(httpServer)
      .post('/posts')
      .set(withSession(sessionToken))
      .send(createPostPayload(user._id, 'Author'))
      .expect(201);

    const postId = createResponse.body._id;

    const viewResponse = await request(httpServer)
      .post(`/posts/${postId}/view`)
      .expect(201);
    expect(viewResponse.body.isNewView).toBe(true);

    const likeResponse = await request(httpServer)
      .post(`/posts/${postId}/like`)
      .set(withSession(sessionToken))
      .expect(201);
    expect(likeResponse.body.message).toBe('liked');

    const likedCheck = await request(httpServer)
      .get(`/posts/${postId}/liked`)
      .set(withSession(sessionToken))
      .expect(200);
    expect(likedCheck.body.isLiked).toBe(true);
  });

  it('requires authentication to create a post', async () => {
    await request(httpServer)
      .post('/posts')
      .send(createPostPayload(PLACEHOLDER_MONGO_ID, 'Anonymous'))
      .expect(401);
  });
});
