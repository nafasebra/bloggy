import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { createMockModel } from '../test/mongoose-mock';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    userModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  function mockFindByIdChain(result: unknown) {
    userModel.findById.mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      }),
    });
  }

  describe('findOne', () => {
    it('returns user without password', async () => {
      mockFindByIdChain({
        _id: 'user-1',
        name: 'Jane',
        username: 'jane',
        email: 'jane@example.com',
        password: 'hashed',
      });

      const result = await service.findOne('user-1');

      expect(userModel.findById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({
        _id: 'user-1',
        name: 'Jane',
        username: 'jane',
        email: 'jane@example.com',
      });
    });

    it('throws NotFoundException when user does not exist', async () => {
      mockFindByIdChain(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('updates and returns user', async () => {
      const updatedDoc = {
        _id: 'user-1',
        name: 'Updated',
        isNew: true,
        save: jest.fn().mockResolvedValue(undefined),
      };
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDoc),
      });

      const result = await service.update('user-1', { name: 'Updated' });

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-1',
        { name: 'Updated' },
        { new: true }
      );
      expect(updatedDoc.save).toHaveBeenCalled();
      expect(result).toBe(updatedDoc);
    });

    it('throws NotFoundException when user does not exist', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('missing', { name: 'X' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('deletes and returns user', async () => {
      const deleted = { _id: 'user-1', name: 'Jane' };
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleted),
      });

      const result = await service.remove('user-1');

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('user-1');
      expect(result).toBe(deleted);
    });

    it('throws NotFoundException when user does not exist', async () => {
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findAll', () => {
    it('returns users without password field', async () => {
      const users = [{ _id: 'user-1', name: 'Jane' }];
      const chain = {
        select: jest.fn(),
        lean: jest.fn(),
        exec: jest.fn().mockResolvedValue(users),
      };
      chain.select.mockReturnValue(chain);
      chain.lean.mockReturnValue(chain);
      userModel.find.mockReturnValue(chain);

      const result = await service.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(chain.select).toHaveBeenCalledWith({ password: 0, __v: 0 });
      expect(result).toEqual(users);
    });
  });
});
