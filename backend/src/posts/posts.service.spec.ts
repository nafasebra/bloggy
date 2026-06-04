import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './schemas/post.schema';
import { PostView } from './schemas/post-view.schema';
import { PostLike } from './schemas/post-like.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockModel } from '../test/mongoose-mock';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    postModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModel },
        { provide: getModelToken(PostView.name), useValue: createMockModel() },
        { provide: getModelToken(PostLike.name), useValue: createMockModel() },
        { provide: getModelToken(User.name), useValue: createMockModel() },
        {
          provide: NotificationsService,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('findById', () => {
    it('returns post when found', async () => {
      const post = { _id: 'post-1', title: 'Hello' };
      postModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      });

      await expect(service.findById('post-1')).resolves.toBe(post);
    });

    it('throws NotFoundException when post is missing', async () => {
      postModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findBySearch', () => {
    it('returns all posts when query is empty', async () => {
      const posts = [{ _id: 'post-1' }];
      const chain = {
        sort: jest.fn(),
        exec: jest.fn().mockResolvedValue(posts),
      };
      chain.sort.mockReturnValue(chain);
      postModel.find.mockReturnValue(chain);

      const result = await service.findBySearch('   ');

      expect(postModel.find).toHaveBeenCalled();
      expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(posts);
    });

    it('searches title and category when query is provided', async () => {
      const chain = {
        sort: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      };
      chain.sort.mockReturnValue(chain);
      postModel.find.mockReturnValue(chain);

      await service.findBySearch('tech');

      expect(postModel.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: 'tech', $options: 'i' } },
          { category: { $regex: 'tech', $options: 'i' } },
        ],
      });
    });
  });

  describe('findByCategory', () => {
    it('filters by category', async () => {
      const chain = {
        sort: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      };
      chain.sort.mockReturnValue(chain);
      postModel.find.mockReturnValue(chain);

      await service.findByCategory('Technology');

      expect(postModel.find).toHaveBeenCalledWith({
        category: { $regex: 'Technology', $options: 'i' },
      });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when post does not exist', async () => {
      postModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('missing', { title: 'Updated' } as UpdatePostDto)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
