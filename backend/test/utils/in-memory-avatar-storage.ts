import { NotFoundException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { AvatarStorage } from '../../src/storage/avatar-storage';

export class InMemoryAvatarStorage extends AvatarStorage {
  readonly objects = new Map<string, Buffer>();

  put(key: string, data: Buffer): Promise<void> {
    this.objects.set(key, Buffer.from(data));
    return Promise.resolve();
  }

  get(key: string): Promise<Readable> {
    const data = this.objects.get(key);
    if (!data)
      return Promise.reject(new NotFoundException('Profile photo not found'));
    return Promise.resolve(Readable.from(data));
  }

  remove(key: string): Promise<void> {
    this.objects.delete(key);
    return Promise.resolve();
  }
}
