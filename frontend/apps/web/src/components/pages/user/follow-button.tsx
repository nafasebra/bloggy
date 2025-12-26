'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import http from '@/lib/http';
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { accessToken, user } = useAuth();

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!accessToken || !user?._id) return;

      try {
        const response = await http.get(
          `/users/${user._id}/is-following/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Failed to check follow status', error);
      }
    };

    checkFollowStatus();
  }, [userId, accessToken, user?._id]);

  const handleClick = async () => {
    if (!accessToken) {
      toast.error('Please log in to follow users');
      return;
    }

    if (!user?._id) {
      toast.error('User information not available');
      return;
    }

    if (user._id === userId) {
      toast.error('You cannot follow yourself');
      return;
    }

    setLoading(true);

    try {
      const response = await http.post(
        `/users/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setIsFollowing(response.data.isFollowing);
      const message = response.data.isFollowing
        ? 'User followed successfully'
        : 'User unfollowed successfully';
      toast.success(message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update follow status';
      toast.error(errorMessage);
      console.error('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-[130px] font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
