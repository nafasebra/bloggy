import { ConfigService } from '@nestjs/config';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { Client } from 'minio';
import { MinioAvatarStorage } from './minio-avatar-storage';

jest.mock('minio', () => ({ Client: jest.fn() }));

describe('MinioAvatarStorage', () => {
  const client = {
    bucketExists: jest.fn(),
    makeBucket: jest.fn(),
    putObject: jest.fn(),
    getObject: jest.fn(),
    removeObject: jest.fn(),
  };
  let storage: MinioAvatarStorage;

  beforeEach(() => {
    jest.resetAllMocks();
    (Client as jest.Mock).mockImplementation(() => client);
    client.bucketExists.mockResolvedValue(false);
    storage = new MinioAvatarStorage(
      new ConfigService({
        MINIO_ENDPOINT: 'https://objects.example.com:9443',
        MINIO_ACCESS_KEY: 'test-user',
        MINIO_SECRET_KEY: 'test-password',
      })
    );
  });

  it('configures TLS and server-only credentials from the environment', () => {
    expect(Client).toHaveBeenCalledWith(
      expect.objectContaining({
        endPoint: 'objects.example.com',
        port: 9443,
        useSSL: true,
        accessKey: 'test-user',
        secretKey: 'test-password',
      })
    );
  });

  it('creates the private bucket once across concurrent first uploads', async () => {
    const data = Buffer.from('photo');
    await Promise.all([
      storage.put('first.png', data, 'image/png'),
      storage.put('second.png', data, 'image/png'),
    ]);
    expect(client.makeBucket).toHaveBeenCalledTimes(1);
    expect(client.putObject).toHaveBeenCalledWith(
      'profile-photos',
      'first.png',
      data,
      data.length,
      { 'Content-Type': 'image/png' }
    );
  });

  it('retries bucket initialization after an outage and returns a safe error', async () => {
    client.bucketExists.mockRejectedValueOnce(
      new Error('sensitive endpoint detail')
    );
    await expect(
      storage.put('a.png', Buffer.from('a'), 'image/png')
    ).rejects.toThrow(ServiceUnavailableException);
    await storage.put('a.png', Buffer.from('a'), 'image/png');
    expect(client.bucketExists).toHaveBeenCalledTimes(2);
    expect(client.putObject).toHaveBeenCalledTimes(1);
  });

  it('allows another replica to win the bucket creation race', async () => {
    client.makeBucket.mockRejectedValue({ code: 'BucketAlreadyOwnedByYou' });
    await storage.put('a.png', Buffer.from('a'), 'image/png');
    expect(client.putObject).toHaveBeenCalledTimes(1);
  });

  it('streams reads, maps missing keys to 404, and removes objects', async () => {
    const stream = Readable.from('photo');
    client.getObject
      .mockResolvedValueOnce(stream)
      .mockRejectedValueOnce({ code: 'NoSuchKey' });
    expect(await storage.get('a.png')).toBe(stream);
    await expect(storage.get('missing.png')).rejects.toThrow(NotFoundException);
    await storage.remove('a.png');
    expect(client.removeObject).toHaveBeenCalledWith('profile-photos', 'a.png');
  });
});
