import type { Readable } from 'node:stream';

/** Storage boundary shared by the real MinIO adapter and isolated HTTP tests. */
export abstract class AvatarStorage {
  abstract put(key: string, data: Buffer, contentType: string): Promise<void>;
  abstract get(key: string): Promise<Readable>;
  abstract remove(key: string): Promise<void>;
}

export const AVATAR_KEY_PATTERN =
  /^[a-f0-9-]{36}-[a-f0-9-]{36}\.(jpg|png|gif|webp)$/;
