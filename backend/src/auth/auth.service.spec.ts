import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import { createMockModel } from '../test/mongoose-mock';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnType<typeof createMockModel>;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    userModel = createMockModel();
    jwtService = { sign: jest.fn().mockReturnValue('jwt-token') };
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('hashes password and saves user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      const savedUser = {
        _id: 'user-1',
        name: 'Jane',
        username: 'jane',
        email: 'jane@example.com',
      };
      userModel.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedUser),
      }));

      const result = await service.register({
        name: 'Jane',
        username: 'jane',
        email: 'jane@example.com',
        password: 'secret123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
      expect(userModel).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane',
          username: 'jane',
          email: 'jane@example.com',
          password: 'hashed-password',
        })
      );
      expect(result).toEqual(savedUser);
    });

    it('throws ConflictException on duplicate key', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userModel.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue({ code: 11000 }),
      }));

      await expect(
        service.register({
          name: 'Jane',
          username: 'jane',
          email: 'jane@example.com',
          password: 'secret123',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const user = {
      _id: 'user-1',
      name: 'Jane',
      username: 'jane',
      email: 'jane@example.com',
      password: 'hashed-password',
      isNew: false,
      role: 'user',
    };

    it('returns session token and user on valid credentials', async () => {
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        username: 'jane',
        password: 'secret123',
      });

      expect(userModel.findOne).toHaveBeenCalledWith({
        $or: [{ username: 'jane' }, { email: 'jane' }],
      });
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        session_token: 'jwt-token',
        user: {
          _id: 'user-1',
          name: 'Jane',
          username: 'jane',
          email: 'jane@example.com',
          isNew: false,
          role: 'user',
        },
      });
    });

    it('throws UnauthorizedException when user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.login({ username: 'unknown', password: 'secret123' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ username: 'jane', password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    it('updates password when old password is valid', async () => {
      userModel.findById.mockResolvedValue({
        _id: 'user-1',
        password: 'old-hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');
      userModel.findByIdAndUpdate.mockResolvedValue(undefined);

      await service.changePassword('user-1', {
        old_password: 'old',
        new_password: 'new',
      });

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user-1', {
        password: 'new-hash',
      });
    });

    it('throws when old password is invalid', async () => {
      userModel.findById.mockResolvedValue({
        _id: 'user-1',
        password: 'old-hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', {
          old_password: 'wrong',
          new_password: 'new',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgetPassword', () => {
    it('returns silently when email is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.forgetPassword({ email: 'missing@example.com' })
      ).resolves.toBeUndefined();
    });

    it('signs reset token when user exists', async () => {
      userModel.findOne.mockResolvedValue({ _id: 'user-1' });

      await service.forgetPassword({ email: 'jane@example.com' });

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: 'user-1', purpose: 'password-reset' },
        { expiresIn: '1h' }
      );
    });
  });
});
