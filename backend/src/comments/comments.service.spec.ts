import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';
import { CommentLike } from './schemas/comment-like.schema';
import { Post } from '../posts/schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockModel } from '../test/mongoose-mock';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentModel: ReturnType<typeof createMockModel>;
  let postModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    commentModel = createMockModel();
    postModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken(Comment.name), useValue: commentModel },
        {
          provide: getModelToken(CommentLike.name),
          useValue: createMockModel(),
        },
        { provide: getModelToken(Post.name), useValue: postModel },
        { provide: getModelToken(User.name), useValue: createMockModel() },
        {
          provide: NotificationsService,
          useValue: { create: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  describe('findByPostId', () => {
    it('returns empty array when no comments exist', async () => {
      commentModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.findByPostId('post-1')).resolves.toEqual([]);
    });

    it('returns comments for a post', async () => {
      const comments = [{ _id: 'comment-1', content: 'Nice post' }];
      commentModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(comments),
        }),
      });

      await expect(service.findByPostId('post-1')).resolves.toEqual(comments);
      expect(commentModel.find).toHaveBeenCalledWith({ postId: 'post-1' });
    });
  });

  describe('create', () => {
    it('throws NotFoundException when post does not exist', async () => {
      const savedComment = {
        _id: 'comment-1',
        authorId: 'user-2',
        content: 'Hello',
      };
      commentModel.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedComment),
      }));
      postModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.create('post-1', {
          postId: 'post-1',
          content: 'Hello',
          authorId: 'user-2',
          authorName: 'Jane',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
