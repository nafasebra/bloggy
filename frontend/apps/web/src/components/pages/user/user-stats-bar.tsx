import type { ReactNode } from 'react';
import { StatBlock } from '@/components/ui/stat-block';

interface UserStatsBarProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  actions?: ReactNode;
}

export function UserStatsBar({
  postsCount,
  followersCount,
  followingCount,
  actions,
}: UserStatsBarProps) {
  return (
    <div className="flex flex-wrap items-center space-x-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <StatBlock value={postsCount} label="Posts" />
      <StatBlock value={followersCount} label="Followers" />
      <StatBlock value={followingCount} label="Following" />
      {actions}
    </div>
  );
}
