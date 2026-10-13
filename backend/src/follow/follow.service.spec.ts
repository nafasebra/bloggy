import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { createMockRepository } from '../test/repository-mock';

describe('FollowService', () => {
  let service: FollowService;
  let repos: Record<string, ReturnType<typeof createMockRepository>>;
  let notifications: { create: jest.Mock };
  beforeEach(async () => {
    repos = { Follow: createMockRepository(), User: createMockRepository() };
    notifications = { create: jest.fn().mockResolvedValue(undefined) };
    const module = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: getRepositoryToken(Follow), useValue: repos.Follow },
        { provide: getRepositoryToken(User), useValue: repos.User },
        { provide: NotificationsService, useValue: notifications },
      ],
    }).compile();
    service = module.get(FollowService);
  });
  it('prevents self-following', async () => {
    await expect(service.toggleFollow('user-1', 'user-1')).rejects.toThrow(
      BadRequestException
    );
  });
  it('rejects nonexistent users', async () => {
    await expect(service.validateUser('missing')).rejects.toThrow(
      NotFoundException
    );
  });
  it('unfollows an existing relationship', async () => {
    repos.User.findOneBy.mockResolvedValue({ _id: 'user-1' });
    repos.Follow.findOneBy.mockResolvedValue({ _id: 'follow-1' });
    expect(await service.toggleFollow('user-1', 'user-2')).toEqual({
      isFollowing: false,
    });
    expect(repos.Follow.delete).toHaveBeenCalledWith({
      followerId: 'user-1',
      followingId: 'user-2',
    });
  });
  it('follows and creates a notification', async () => {
    repos.User.findOneBy.mockResolvedValue({ _id: 'user-1', name: 'Jane' });
    expect(await service.toggleFollow('user-1', 'user-2')).toEqual({
      isFollowing: true,
    });
    expect(notifications.create).toHaveBeenCalled();
  });
  it('populates follow lists and counts relationships', async () => {
    repos.Follow.find.mockResolvedValue([
      { _id: 'follow-1', followingId: 'user-2', following: { _id: 'user-2' } },
    ]);
    expect(await service.getFollowing('user-1')).toEqual([
      { _id: 'follow-1', followingId: { _id: 'user-2' } },
    ]);
    repos.Follow.countBy.mockResolvedValue(3);
    expect(await service.getFollowerCount('user-1')).toBe(3);
  });
});
