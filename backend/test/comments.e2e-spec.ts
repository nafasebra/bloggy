import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import { registerAndLogin, uniqueUser, withSession } from './utils/auth';

describe('Comments (e2e)', () => {
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

  async function createPostForUser(
    sessionToken: string,
    userId: string,
    authorName: string
  ) {
    const response = await request(httpServer)
      .post('/posts')
      .set(withSession(sessionToken))
      .send({
        title: 'Post for comments',
        content: 'Content',
        excerpt: 'Excerpt',
        category: 'General',
        tags: ['test'],
        authorId: userId,
        authorName,
        createdAt: new Date().toISOString(),
      })
      .expect(201);
    return response.body._id as string;
  }

  it('creates, lists, replies to, likes, and deletes comments', async () => {
    const { user, sessionToken } = await registerAndLogin(
      httpServer,
      uniqueUser('commenter')
    );
    const postId = await createPostForUser(
      sessionToken,
      user._id,
      user.username ?? 'Author'
    );

    const createResponse = await request(httpServer)
      .post(`/comments/${postId}`)
      .set(withSession(sessionToken))
      .send({
        content: 'Great post!',
        postId,
        authorId: user._id,
        authorName: user.username ?? 'Author',
      })
      .expect(201);

    const commentId = createResponse.body._id;

    const listResponse = await request(httpServer)
      .get(`/comments/${postId}`)
      .expect(200);
    expect(listResponse.body).toHaveLength(1);

    const replyResponse = await request(httpServer)
      .put(`/comments/reply/${postId}`)
      .set(withSession(sessionToken))
      .send({
        content: 'Thanks!',
        postId,
        parentId: commentId,
        authorId: user._id,
        authorName: user.username ?? 'Author',
      })
      .expect(200);
    expect(replyResponse.body.content).toBe('Thanks!');

    const likeResponse = await request(httpServer)
      .put(`/comments/${commentId}/like`)
      .expect(200);
    expect(likeResponse.body.likes).toBeGreaterThanOrEqual(1);

    const likeCheck = await request(httpServer)
      .get(`/comments/${commentId}/like`)
      .expect(200);
    expect(likeCheck.body.isLiked).toBe(true);

    await request(httpServer)
      .delete(`/comments/${commentId}`)
      .set(withSession(sessionToken))
      .expect(200);
  });

  it('forbids deleting another users comment', async () => {
    const author = await registerAndLogin(httpServer, uniqueUser('cauthor'));
    const other = await registerAndLogin(httpServer, uniqueUser('cother'));

    const postId = await createPostForUser(
      author.sessionToken,
      author.user._id,
      'Author'
    );

    const comment = await request(httpServer)
      .post(`/comments/${postId}`)
      .set(withSession(author.sessionToken))
      .send({
        content: 'My comment',
        postId,
        authorId: author.user._id,
        authorName: 'Author',
      })
      .expect(201);

    await request(httpServer)
      .delete(`/comments/${comment.body._id}`)
      .set(withSession(other.sessionToken))
      .expect(403);
  });
});
