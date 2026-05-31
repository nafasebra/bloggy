import { LocateIcon } from 'lucide-react';
import { UserAvatar } from '@/components/ui/user-avatar';
import type { User } from '@/types/user';

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
      <UserAvatar name={user.name} src={user.avatar} size="2xl" />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          {user.bio || 'No bio available.'}
        </p>
        <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {user.location && (
            <div className="flex items-center space-x-1">
              <LocateIcon />
              <span>{user.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <LocateIcon />
            <span>
              Joined{' '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Website
            </a>
          )}
          {user.twitter && (
            <a
              href={`https://twitter.com/${user.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {user.twitter}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
