import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockRepository } from '../test/repository-mock';

describe('CommentsService', () => {
  let service: CommentsService;
  let repos: Record<string, ReturnType<typeof createMockRepository>>;
  let notifications: { create: jest.Mock };
  beforeEach(async () => {
    repos = {
      Comment: createMockRepository(),
      CommentLike: createMockRepository(),
      Post: createMockRepository(),
      User: createMockRepository(),
    };
    notifications = { create: jest.fn().mockResolvedValue(undefined) };
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: repos.Comment },
        {
          provide: getRepositoryToken(CommentLike),
          useValue: repos.CommentLike,
        },
        { provide: getRepositoryToken(Post), useValue: repos.Post },
        { provide: getRepositoryToken(User), useValue: repos.User },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = module.get(CommentsService);
  });
  it('returns populated authors in the existing API field', async () => {
    repos.Comment.find.mockResolvedValue([
      {
        _id: 'comment-1',
        authorId: 'user-1',
        author: { _id: 'user-1', name: 'Jane' },
      },
    ]);
    expect(await service.findByPostId('post-1')).toEqual([
      { _id: 'comment-1', authorId: { _id: 'user-1', name: 'Jane' } },
    ]);
  });
  it('rejects a missing post before inserting a comment', async () => {
    await expect(
      service.create('missing', {
        content: 'Hello',
        authorId: 'user-1',
        authorName: 'Jane',
        postId: 'missing',
      })
    ).rejects.toThrow(NotFoundException);
    expect(repos.Comment.save).not.toHaveBeenCalled();
  });
  it('rejects replies to comments in another post before inserting', async () => {
    repos.Comment.findOneBy.mockResolvedValue({
      _id: 'parent-1',
      postId: 'post-2',
    });
    repos.Post.findOneBy.mockResolvedValue({ _id: 'post-1' });
    await expect(
      service.reply('post-1', {
        content: 'Reply',
        parentId: 'parent-1',
        postId: 'post-1',
        authorId: 'user-1',
        authorName: 'Jane',
      })
    ).rejects.toThrow(BadRequestException);
    expect(repos.Comment.save).not.toHaveBeenCalled();
  });
  it('does not decrement likes below zero on unlike', async () => {
    repos.Comment.findOne.mockResolvedValue({ _id: 'comment-1', likes: 0 });
    repos.CommentLike.findOneBy.mockResolvedValue({ _id: 'like-1' });
    repos.Comment.manager.transaction.mockImplementation(fn =>
      fn({
        getRepository: (entity: unknown) =>
          entity === Comment ? repos.Comment : repos.CommentLike,
      })
    );
    expect(await service.like('comment-1', '127.0.0.1')).toMatchObject({
      likes: 0,
    });
  });
});
