'use client';
import React, { useState } from 'react';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const handleClick = () => {
    setIsFollowing((prev) => !prev);
  };

  console.log(userId);

  return (
    <button
      onClick={handleClick}
      className={`w-[130px] font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'bg-gray-200 text-gray-700'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
