import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findOne: jest.Mock;
    update: jest.Mock;
    findAll: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('update', () => {
    it('updates own profile', async () => {
      const updated = { _id: 'user-1', name: 'Jane' };
      usersService.update.mockResolvedValue(updated);

      const result = await controller.update(
        'user-1',
        { name: 'Jane' },
        { user: { userId: 'user-1' } }
      );

      expect(usersService.update).toHaveBeenCalledWith('user-1', {
        name: 'Jane',
      });
      expect(result).toBe(updated);
    });

    it('forbids updating another user profile', () => {
      expect(() =>
        controller.update(
          'user-2',
          { name: 'Hacker' },
          { user: { userId: 'user-1' } }
        )
      ).toThrow(ForbiddenException);
    });
  });

  describe('uploadAvatar', () => {
    it('uploads avatar for own profile', async () => {
      const updated = {
        _id: 'user-1',
        avatar: '/uploads/avatars/user-1-123.jpg',
      };
      usersService.update.mockResolvedValue(updated);

      const file = {
        filename: 'user-1-123.jpg',
      } as Express.Multer.File;

      const result = await controller.uploadAvatar('user-1', file, {
        user: { userId: 'user-1' },
      });

      expect(usersService.update).toHaveBeenCalledWith('user-1', {
        avatar: '/uploads/avatars/user-1-123.jpg',
      });
      expect(result).toBe(updated);
    });

    it('requires a file', () => {
      expect(() =>
        controller.uploadAvatar('user-1', undefined as never, {
          user: { userId: 'user-1' },
        })
      ).toThrow(BadRequestException);
    });

    it('forbids uploading avatar for another user', () => {
      expect(() =>
        controller.uploadAvatar(
          'user-2',
          { filename: 'x.jpg' } as Express.Multer.File,
          { user: { userId: 'user-1' } }
        )
      ).toThrow(ForbiddenException);
    });
  });
});
