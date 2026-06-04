import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { Follow } from './schemas/follow.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockModel } from '../test/mongoose-mock';

describe('FollowService', () => {
  let service: FollowService;
  let followModel: ReturnType<typeof createMockModel>;
  let userModel: ReturnType<typeof createMockModel>;
  let notificationsService: { create: jest.Mock };

  beforeEach(async () => {
    followModel = createMockModel();
    userModel = createMockModel();
    notificationsService = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: getModelToken(Follow.name), useValue: followModel },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
  });

  describe('validateUser', () => {
    it('returns user when found', async () => {
      const user = { _id: 'user-1' };
      userModel.findById.mockResolvedValue(user);

      await expect(service.validateUser('user-1')).resolves.toBe(user);
    });

    it('throws NotFoundException when user is missing', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.validateUser('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('toggleFollow', () => {
    it('prevents following yourself', async () => {
      await expect(service.toggleFollow('user-1', 'user-1')).rejects.toThrow(
        BadRequestException
      );
    });

    it('unfollows when relationship already exists', async () => {
      userModel.findById.mockResolvedValue({ _id: 'user-1' });
      followModel.findOne.mockResolvedValue({ _id: 'follow-1' });
      followModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.toggleFollow('user-1', 'user-2');

      expect(followModel.deleteOne).toHaveBeenCalledWith({
        followerId: 'user-1',
        followingId: 'user-2',
      });
      expect(result).toEqual({ isFollowing: false });
    });

    it('follows when relationship does not exist', async () => {
      const follower = { _id: 'user-1', name: 'Jane', username: 'jane' };
      userModel.findById.mockImplementation((id: string) => {
        const user = id === 'user-1' ? follower : { _id: 'user-2' };
        return {
          exec: jest.fn().mockResolvedValue(user),
          then: (resolve: (value: unknown) => void) => resolve(user),
        };
      });
      followModel.findOne.mockResolvedValue(null);

      const result = await service.toggleFollow('user-1', 'user-2');

      expect(followModel).toHaveBeenCalledWith({
        followerId: 'user-1',
        followingId: 'user-2',
      });
      expect(notificationsService.create).toHaveBeenCalled();
      expect(result).toEqual({ isFollowing: true });
    });
  });

  describe('isFollowing', () => {
    it('returns true when follow exists', async () => {
      followModel.findOne.mockResolvedValue({ _id: 'follow-1' });

      await expect(service.isFollowing('user-1', 'user-2')).resolves.toEqual({
        isFollowing: true,
      });
    });

    it('returns false when follow does not exist', async () => {
      followModel.findOne.mockResolvedValue(null);

      await expect(service.isFollowing('user-1', 'user-2')).resolves.toEqual({
        isFollowing: false,
      });
    });
  });

  describe('getFollowerCount', () => {
    it('returns follower count', async () => {
      followModel.countDocuments.mockResolvedValue(3);

      await expect(service.getFollowerCount('user-1')).resolves.toBe(3);
      expect(followModel.countDocuments).toHaveBeenCalledWith({
        followingId: 'user-1',
      });
    });
  });
});
