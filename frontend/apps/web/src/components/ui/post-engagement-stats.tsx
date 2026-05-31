import { Eye, Heart } from 'lucide-react';
import { cn } from '@repo/ui/utils';

interface PostEngagementStatsProps {
  views?: number;
  likes?: number;
  className?: string;
}

export function PostEngagementStats({
  views = 0,
  likes = 0,
  className,
}: PostEngagementStatsProps) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span>{views}</span>
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <Heart className="w-4 h-4" />
        <span>{likes}</span>
      </span>
    </div>
  );
}
