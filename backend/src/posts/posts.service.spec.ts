import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { ILike } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { PostView } from './entities/post-view.entity';
import { PostLike } from './entities/post-like.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockRepository } from '../test/repository-mock';

describe('PostsService', () => {
  let service: PostsService;
  let repos: Record<string, ReturnType<typeof createMockRepository>>;
  let notifications: { create: jest.Mock };
  beforeEach(async () => {
    repos = {
      Post: createMockRepository(),
      PostView: createMockRepository(),
      PostLike: createMockRepository(),
      User: createMockRepository(),
    };
    notifications = { create: jest.fn().mockResolvedValue(undefined) };
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: repos.Post },
        { provide: getRepositoryToken(PostView), useValue: repos.PostView },
        { provide: getRepositoryToken(PostLike), useValue: repos.PostLike },
        { provide: getRepositoryToken(User), useValue: repos.User },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = module.get(PostsService);
  });
  it('throws for a missing post or update target', async () => {
    await expect(service.findById('missing')).rejects.toThrow(
      NotFoundException
    );
    await expect(
      service.update('missing', { title: 'Updated' } as never)
    ).rejects.toThrow(NotFoundException);
  });
  it('searches title and category with case-insensitive SQL matching', async () => {
    await service.findBySearch(' tech ');
    expect(repos.Post.find).toHaveBeenCalledWith({
      where: [{ title: ILike('%tech%') }, { category: ILike('%tech%') }],
      order: { createdAt: 'DESC' },
    });
    await service.findBySearch('  ');
    expect(repos.Post.find).toHaveBeenLastCalledWith({
      where: {},
      order: { createdAt: 'DESC' },
    });
    await service.findByCategory('Technology');
    expect(repos.Post.find).toHaveBeenLastCalledWith({
      where: { category: ILike('%Technology%') },
      order: { createdAt: 'DESC' },
    });
  });
  it.each([true, false])(
    'counts a view only when its unique row was inserted: %s',
    async inserted => {
      const post = { _id: 'post-1', views: 4 };
      repos.Post.findOne.mockResolvedValue(post);
      const builder = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest
          .fn()
          .mockResolvedValue({ raw: inserted ? [{ _id: 'view-1' }] : [] }),
      };
      const manager = {
        getRepository: (entity: unknown) =>
          entity === Post ? repos.Post : { createQueryBuilder: () => builder },
      };
      repos.Post.manager.transaction.mockImplementation(fn => fn(manager));
      expect(await service.viewPost('post-1', '127.0.0.1')).toMatchObject({
        post: { views: inserted ? 5 : 4 },
        isNewView: inserted,
      });
      expect(repos.Post.save).toHaveBeenCalledTimes(inserted ? 1 : 0);
    }
  );
  it.each([true, false])(
    'toggles the like record and count together: existing=%s',
    async existing => {
      repos.Post.findOne.mockResolvedValue({
        _id: 'post-1',
        authorId: 'user-1',
        likes: 2,
      });
      repos.PostLike.findOneBy.mockResolvedValue(
        existing ? { _id: 'like-1' } : null
      );
      const manager = {
        getRepository: (entity: unknown) =>
          entity === Post ? repos.Post : repos.PostLike,
      };
      repos.Post.manager.transaction.mockImplementation(fn => fn(manager));
      const result = await service.toggleLikePost('post-1', '127.0.0.1');
      expect(result).toMatchObject({
        isLiked: !existing,
        post: { likes: existing ? 1 : 3 },
      });
      expect(repos.Post.save).toHaveBeenCalled();
      expect(
        existing ? repos.PostLike.delete : repos.PostLike.save
      ).toHaveBeenCalled();
    }
  );
});
