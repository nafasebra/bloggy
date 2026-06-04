import http, { getApiBaseUrl } from '@/lib/http';
import type { User } from '@/types/user';

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
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await http.post<User>(`/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
