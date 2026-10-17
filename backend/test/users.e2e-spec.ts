import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { clearDatabase, closeE2eApp, createE2eApp } from './utils/e2e-app';
import { registerAndLogin, uniqueUser, withSession } from './utils/auth';
import { readFile, readdir, unlink } from 'node:fs/promises';
import { UsersService } from '../src/users/users.service';
import { basename, join } from 'node:path';
import { AVATAR_UPLOAD_DIR } from '../src/users/avatar-upload.config';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let httpServer: App;
  const uploadedFiles: string[] = [];
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGZkAAAAASUVORK5CYII=',
    'base64'
  );

  beforeAll(async () => {
    app = await createE2eApp();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await Promise.all(
      uploadedFiles.map(file => unlink(file).catch(() => undefined))
    );
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

  it('uploads an avatar with a safe extension, persists it, and removes the replaced file', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);
    const upload = () =>
      request(httpServer)
        .post(`/users/${user._id}/avatar`)
        .set(withSession(sessionToken))
        .attach('avatar', png, {
          filename: 'photo.html',
          contentType: 'image/png',
        });
    const first = await upload().expect(200);
    const firstPath = join(
      AVATAR_UPLOAD_DIR,
      basename(first.body.avatar as string)
    );
    uploadedFiles.push(firstPath);
    expect(first.body.avatar).toMatch(/\.png$/);
    expect(await readFile(firstPath)).toEqual(png);
    await request(httpServer)
      .get(first.body.avatar as string)
      .expect(200)
      .expect('Content-Type', /image\/png/);
    const second = await upload().expect(200);
    uploadedFiles.push(
      join(AVATAR_UPLOAD_DIR, basename(second.body.avatar as string))
    );
    expect(second.body.avatar).not.toBe(first.body.avatar);
    await expect(readFile(firstPath)).rejects.toMatchObject({ code: 'ENOENT' });
    const me = await request(httpServer)
      .get('/users/me')
      .set(withSession(sessionToken))
      .expect(200);
    expect(me.body.avatar).toBe(second.body.avatar);
    expect(me.body.password).toBeUndefined();
  });

  it('removes only the signed-in users photo and cleans up its file', async () => {
    const owner = await registerAndLogin(httpServer, uniqueUser('removephoto'));
    const other = await registerAndLogin(httpServer, uniqueUser('otherphoto'));
    const path = `/users/${owner.user._id}/avatar`;
    const uploaded = await request(httpServer)
      .post(path)
      .set(withSession(owner.sessionToken))
      .attach('avatar', png, 'photo.png')
      .expect(200);
    const diskPath = join(
      AVATAR_UPLOAD_DIR,
      basename(uploaded.body.avatar as string)
    );
    uploadedFiles.push(diskPath);
    await request(httpServer).delete(path).expect(401);
    await request(httpServer)
      .delete(path)
      .set(withSession(other.sessionToken))
      .expect(403);
    expect(await readFile(diskPath)).toEqual(png);
    const removed = await request(httpServer)
      .delete(path)
      .set(withSession(owner.sessionToken))
      .expect(200);
    expect(removed.body.avatar).toBe('');
    expect(removed.body.username).toBe(owner.user.username);
    expect(removed.body.password).toBeUndefined();
    await expect(readFile(diskPath)).rejects.toMatchObject({ code: 'ENOENT' });
    const me = await request(httpServer)
      .get('/users/me')
      .set(withSession(owner.sessionToken))
      .expect(200);
    expect(me.body.avatar).toBe('');
    // Removal also works when the photo is already absent.
    await request(httpServer)
      .delete(path)
      .set(withSession(owner.sessionToken))
      .expect(200);
  });

  it('rejects missing, spoofed, unsupported, and oversized images', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);
    const upload = () =>
      request(httpServer)
        .post(`/users/${user._id}/avatar`)
        .set(withSession(sessionToken));
    await upload().expect(400);
    await upload()
      .attach('avatar', Buffer.from('not an image'), {
        filename: 'fake.png',
        contentType: 'image/png',
      })
      .expect(400);
    await upload()
      .attach('avatar', Buffer.from('<svg/>'), {
        filename: 'a.svg',
        contentType: 'image/svg+xml',
      })
      .expect(400);
    await upload()
      .attach('avatar', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'large.png',
        contentType: 'image/png',
      })
      .expect(413);
  });

  it('requires authentication and refuses uploads for another user', async () => {
    const owner = await registerAndLogin(httpServer, uniqueUser('avatarowner'));
    const other = await registerAndLogin(httpServer, uniqueUser('avatarother'));
    await request(httpServer)
      .post(`/users/${owner.user._id}/avatar`)
      .attach('avatar', png, 'photo.png')
      .expect(401);
    await request(httpServer)
      .post(`/users/${owner.user._id}/avatar`)
      .set(withSession(other.sessionToken))
      .attach('avatar', png, 'photo.png')
      .expect(403);
  });

  it('removes the new upload if saving its profile reference fails', async () => {
    const { user, sessionToken } = await registerAndLogin(httpServer);
    const update = jest
      .spyOn(app.get(UsersService), 'update')
      .mockRejectedValueOnce(new Error('Test save failure'));
    try {
      await request(httpServer)
        .post(`/users/${user._id}/avatar`)
        .set(withSession(sessionToken))
        .attach('avatar', png, 'photo.png')
        .expect(500);
      expect(
        (await readdir(AVATAR_UPLOAD_DIR)).filter(file =>
          file.startsWith(`${user._id}-`)
        )
      ).toEqual([]);
    } finally {
      update.mockRestore();
    }
  });
});
