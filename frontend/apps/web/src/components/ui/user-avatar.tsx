import Image from 'next/image';
import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: { container: 'w-8 h-8', text: 'text-sm', image: 32 },
  md: { container: 'w-10 h-10', text: 'text-sm', image: 40 },
  lg: { container: 'w-14 h-14', text: 'text-xl', image: 56 },
  xl: { container: 'w-16 h-16', text: 'text-lg', image: 64 },
  '2xl': { container: 'w-24 h-24', text: 'text-2xl', image: 96 },
} as const;

type UserAvatarSize = keyof typeof sizeClasses;

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: UserAvatarSize;
  className?: string;
  variant?: 'default' | 'green';
}

export function UserAvatar({
  name,
  src,
  size = 'sm',
  className,
  variant = 'default',
}: UserAvatarProps) {
  const { container, text, image } = sizeClasses[size];
  const initial = name.charAt(0).toUpperCase();
  const gradientClass =
    variant === 'green'
      ? 'bg-linear-to-r from-green-500 to-blue-600'
      : 'bg-linear-to-r from-blue-500 to-purple-600';

  if (src && src.startsWith('http')) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex-shrink-0',
          container,
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          width={image}
          height={image}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        gradientClass,
        container,
        className
      )}
    >
      <span className={cn('text-white font-bold', text)}>
        {src && src.length <= 2 ? src : initial}
      </span>
    </div>
  );
}
