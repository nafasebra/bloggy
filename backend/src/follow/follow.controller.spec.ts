import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

describe('FollowController', () => {
  let controller: FollowController;
  let followService: {
    toggleFollow: jest.Mock;
    getFollowing: jest.Mock;
    getFollowers: jest.Mock;
    isFollowing: jest.Mock;
    getFollowerCount: jest.Mock;
    getFollowingCount: jest.Mock;
  };

  beforeEach(async () => {
    followService = {
      toggleFollow: jest.fn(),
      getFollowing: jest.fn(),
      getFollowers: jest.fn(),
      isFollowing: jest.fn(),
      getFollowerCount: jest.fn(),
      getFollowingCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [{ provide: FollowService, useValue: followService }],
    }).compile();

    controller = module.get<FollowController>(FollowController);
  });

  it('delegates toggleFollow to service', async () => {
    followService.toggleFollow.mockResolvedValue({ isFollowing: true });

    const result = await controller.toggleFollow('user-2', {
      user: { userId: 'user-1' },
    });

    expect(followService.toggleFollow).toHaveBeenCalledWith('user-1', 'user-2');
    expect(result).toEqual({ isFollowing: true });
  });
});
