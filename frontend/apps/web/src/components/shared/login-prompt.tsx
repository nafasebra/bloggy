import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { cn } from '@/lib/utils';

interface LoginPromptProps {
  message?: string;
  variant?: 'default' | 'dashed';
  buttonSize?: 'default' | 'sm';
}

export function LoginPrompt({
  message = 'Please login to continue',
  variant = 'default',
  buttonSize = 'default',
}: LoginPromptProps) {
  return (
    <div
      className={cn(
        'text-center items-center justify-center flex flex-col gap-3',
        variant === 'dashed'
          ? 'mt-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3'
          : 'bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-5 px-3 rounded-lg'
      )}
    >
      <p
        className={cn(
          variant === 'dashed'
            ? 'text-gray-500 dark:text-gray-400 text-sm'
            : 'text-gray-700 dark:text-gray-300'
        )}
      >
        {message}
      </p>
      <Link href="/auth/login">
        <Button type="button" size={buttonSize === 'sm' ? 'sm' : undefined}>
          Login
        </Button>
      </Link>
    </div>
  );
}
