'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { Badge } from '@repo/ui/badge';

type FollowerUser = {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
};

type FollowDocument = {
  _id: string;
  followerId: FollowerUser;
  followingId: string;
  createdAt: string;
  updatedAt: string;
};

type FollowersResponse = {
  followers: FollowDocument[];
};

type FollowerListProps = {
  userId: string;
};

const FollowerList: React.FC<FollowerListProps> = ({ userId }) => {
  const { data: followersData, isLoading, isError } = useQuery<FollowersResponse>({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const response = await http.get<FollowersResponse>(`/users/${userId}/followers`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Followers
          </h2>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Followers
          </h2>
        </div>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-500 dark:text-red-400 text-lg font-medium">
            Failed to load followers
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const followers = followersData?.followers || [];

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Followers
        </h2>
        <Badge variant="secondary">
          {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
        </Badge>
      </div>
      
      {followers.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No followers yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Start sharing to get followers
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {followers.map((follow: FollowDocument) => {
            const user = follow.followerId;
            const displayName = user.name || user.username || 'Unknown';
            const username = user.username || '';
            const initials = displayName.charAt(0).toUpperCase();
            
            return (
              <Link
                key={follow._id}
                href={`/user/${user._id}`}
                className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200"
              >
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-purple-500 transition-all duration-200">
                      <Image
                        src={user.avatar}
                        alt={displayName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-purple-500 transition-all duration-200">
                      <span className="text-white text-xl font-bold">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {displayName}
                    </h3>
                    {username && displayName !== username && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{username}
                      </span>
                    )}
                  </div>
                  {user.bio ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                      No bio available
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FollowerList;
