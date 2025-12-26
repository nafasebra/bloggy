'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';

type User = {
  _id: string;
  name: string;
  bio: string;
  avatar?: string;
  category?: string;
};

type FollowingListProps = {
  userId: string;
};

const FollowingList: React.FC<FollowingListProps> = ({ userId }) => {
  const { data: followingData, isLoading, isError } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const response = await http.get(`/users/${userId}/following`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Following
        </h2>
        <div className="text-center py-8 text-gray-500">Loading following...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Following
        </h2>
        <div className="text-center py-8 text-red-500">Failed to load following</div>
      </div>
    );
  }

  const following = followingData?.following || [];

  return (
    <div className="space-y-4 pt-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Following ({following.length})
      </h2>
      {following.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Not following anyone yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {following.map((user: User) => (
            <div
              key={user._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {user.avatar || user.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  <Link
                    href={`/user/${user._id}`}
                    className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {user.name}
                  </Link>
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.bio || 'No bio available'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingList;
