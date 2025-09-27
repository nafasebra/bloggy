import React from 'react';
import Link from 'next/link';

type User = {
  id: string;
  avatar: string;
  name: string;
  bio: string;
  postsCount: number;
  followers: number;
  category: string;
};

type FollowingListProps = {
  users?: User[];
};

const mockFollowing: User[] = [
  {
    id: '6',
    avatar: '🧑‍🏫',
    name: 'Frank Miller',
    bio: 'Educator and lifelong learner.',
    postsCount: 28,
    followers: 110,
    category: 'Education',
  },
  {
    id: '7',
    avatar: '👨‍🔬',
    name: 'Grace Lee',
    bio: 'Researcher in AI and robotics.',
    postsCount: 45,
    followers: 200,
    category: 'Science',
  },
  {
    id: '8',
    avatar: '👩‍💻',
    name: 'Helen Carter',
    bio: 'Backend developer. Python lover.',
    postsCount: 32,
    followers: 150,
    category: 'Programming',
  },
  {
    id: '9',
    avatar: '🧑‍🎤',
    name: 'Ian Wright',
    bio: 'Musician and songwriter.',
    postsCount: 18,
    followers: 90,
    category: 'Music',
  },
  {
    id: '10',
    avatar: '👩‍🌾',
    name: 'Julia Green',
    bio: 'Gardener and nature blogger.',
    postsCount: 25,
    followers: 130,
    category: 'Lifestyle',
  },
];

const FollowingList: React.FC<FollowingListProps> = () => (
  <div className="space-y-4 pt-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Following
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {mockFollowing.map((user) => (
        <div
          key={user.id}
          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {user.avatar}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              <Link
                href={`/user/${user.id}`}
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {user.name}
              </Link>
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FollowingList;
