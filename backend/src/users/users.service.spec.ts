import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { createMockRepository } from '../test/repository-mock';

describe('UsersService', () => {
  let service: UsersService;
  let repos: Record<string, ReturnType<typeof createMockRepository>>;
  beforeEach(async () => {
    repos = { User: createMockRepository() };
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repos.User },
      ],
    }).compile();
    service = module.get(UsersService);
  });
  it('returns profiles using the password-excluding repository selection', async () => {
    repos.User.findOneBy.mockResolvedValue({ _id: 'user-1', name: 'Jane' });
    expect(await service.findOne('user-1')).toEqual({
      _id: 'user-1',
      name: 'Jane',
    });
    expect(repos.User.findOneBy).toHaveBeenCalledWith({ _id: 'user-1' });
  });
  it('throws when a profile does not exist', async () => {
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    await expect(service.update('missing', { name: 'X' })).rejects.toThrow(
      NotFoundException
    );
    await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
  });
  it('finishes onboarding when updating a profile', async () => {
    repos.User.findOneBy.mockResolvedValue({ _id: 'user-1', isNew: true });
    expect(await service.update('user-1', { name: 'Updated' })).toMatchObject({
      name: 'Updated',
      isNew: false,
    });
  });
  it('returns the removed profile and deletes the row', async () => {
    repos.User.findOneBy.mockResolvedValue({ _id: 'user-1', name: 'Jane' });
    expect(await service.remove('user-1')).toMatchObject({ _id: 'user-1' });
    expect(repos.User.delete).toHaveBeenCalledWith({ _id: 'user-1' });
  });
  it('does not return the password after saving a user', async () => {
    repos.User.save.mockResolvedValue({ _id: 'user-1', password: 'hash' });
    const result = await service.create({
      name: 'Jane',
      username: 'jane',
      email: 'jane@example.com',
    });
    expect(result).not.toHaveProperty('password');
  });
});
