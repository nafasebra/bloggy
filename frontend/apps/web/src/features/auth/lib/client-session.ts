import { SESSION_HINT_COOKIE } from '@/features/auth/lib/constants';

export function hasSessionHint(): boolean {
  if (typeof document === 'undefined') return false;

  return document.cookie
    .split(';')
    .some((part) => part.trim().startsWith(`${SESSION_HINT_COOKIE}=`));
}
