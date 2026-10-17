import http, { getApiBaseUrl } from '@repo/http-client/web';
import type { User } from '@/features/users/types';

export function resolveAvatarUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http') || src.startsWith('data:')) return src;
  if (src.startsWith('/')) {
    return `${getApiBaseUrl()}${src}`;
  }
  return src;
}

export async function uploadUserAvatar(
  userId: string,
  file: File
): Promise<User> {
  const error = validateAvatarFile(file);
  if (error) throw new Error(error);
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await http.post<User>(`/users/${userId}/avatar`, formData);

  return response.data;
}

export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';

export function validateAvatarFile(
  file: Pick<File, 'type' | 'size'>
): string | undefined {
  if (!AVATAR_ACCEPT.split(',').includes(file.type))
    return 'Choose a JPEG, PNG, GIF, or WebP image.';
  if (file.size === 0) return 'The selected image is empty.';
  if (file.size > 5 * 1024 * 1024) return 'Image must be 5MB or smaller.';
}
