import type { ReactNode } from 'react';
import { cn } from '@repo/ui/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'error';
  className?: string;
  iconWrapperClassName?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  iconWrapperClassName,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full mb-4',
          variant === 'error'
            ? 'w-16 h-16 bg-red-100 dark:bg-red-900/20'
            : 'w-16 h-16 bg-gray-200 dark:bg-gray-700',
          iconWrapperClassName
        )}
      >
        {icon}
      </div>
      <h3
        className={cn(
          'text-lg font-semibold mb-2',
          variant === 'error'
            ? 'text-red-500 dark:text-red-400'
            : 'text-gray-900 dark:text-white'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            variant === 'error'
              ? 'text-gray-400 dark:text-gray-500 text-sm'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
