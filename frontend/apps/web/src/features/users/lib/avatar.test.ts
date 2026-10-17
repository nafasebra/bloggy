import { describe, expect, it, vi, afterEach } from 'vitest';
import http from '@repo/http-client/web';
import { uploadUserAvatar, validateAvatarFile } from './avatar';

afterEach(() => vi.restoreAllMocks());

describe('avatar uploads', () => {
  it('accepts supported images and rejects empty, oversized, or unsupported files', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) {
      expect(validateAvatarFile({ type, size: 1024 })).toBeUndefined();
    }
    expect(validateAvatarFile({ type: 'image/svg+xml', size: 10 })).toContain(
      'JPEG'
    );
    expect(validateAvatarFile({ type: 'image/png', size: 0 })).toContain(
      'empty'
    );
    expect(
      validateAvatarFile({ type: 'image/png', size: 5 * 1024 * 1024 + 1 })
    ).toContain('5MB');
  });

  it('sends multipart data using the shared cookie client without overriding its boundary', async () => {
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    const user = { _id: 'user-1', avatar: '/uploads/avatars/photo.png' };
    const post = vi.spyOn(http, 'post').mockResolvedValue({ data: user });
    expect(await uploadUserAvatar('user-1', file)).toBe(user);
    expect(post).toHaveBeenCalledWith(
      '/users/user-1/avatar',
      expect.any(FormData)
    );
    expect((post.mock.calls[0]?.[1] as FormData).get('avatar')).toBe(file);
  });

  it('rejects invalid files before making a request', async () => {
    const post = vi.spyOn(http, 'post');
    await expect(
      uploadUserAvatar(
        'user-1',
        new File(['bad'], 'bad.svg', { type: 'image/svg+xml' })
      )
    ).rejects.toThrow('JPEG');
    expect(post).not.toHaveBeenCalled();
  });
});
