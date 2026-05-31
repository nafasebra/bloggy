'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import http from '@/lib/http';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Button } from '@repo/ui/button';

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
  const { user } = useAuth();

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user?._id) return;

      try {
        const response = await http.get(
          `/users/${user._id}/is-following/${userId}`
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Failed to check follow status', error);
      }
    };

    checkFollowStatus();
  }, [userId, user?._id]);

  const handleClick = async () => {
    if (!user?._id) {
      toast.error('User information not available. Please login again!');
      return;
    }

    if (user._id === userId) {
      toast.error('You cannot follow yourself');
      return;
    }

    setLoading(true);

    try {
      const response = await http.post(`/users/${userId}/follow`);

      setIsFollowing(response.data.isFollowing);
      const message = response.data.isFollowing
        ? 'User followed successfully'
        : 'User unfollowed successfully';
      toast.success(message);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? (error.response?.data as { message?: string })?.message ||
          'Failed to update follow status'
        : 'Failed to update follow status';
      toast.error(errorMessage);
      console.error('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      variant={isFollowing ? 'secondary' : 'default'}
      className="w-32.5"
    >
      {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
