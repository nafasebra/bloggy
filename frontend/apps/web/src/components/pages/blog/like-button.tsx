'use client';

import { Heart } from 'lucide-react';
import React from 'react';
import { Button } from '@repo/ui/button';
import { usePostLikedQuery } from '@/hooks/query';
import { useTogglePostLikeMutation } from '@/hooks/mutation';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
}

function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
  const { data: likeStatus, isLoading: isCheckingLikeStatus } =
    usePostLikedQuery(postId);
  const toggleLikeMutation = useTogglePostLikeMutation(postId);

  const isLiked = likeStatus?.isLiked ?? false;
  const likes = toggleLikeMutation.data?.post.likes ?? initialLikes;
  const isLoading = toggleLikeMutation.isPending;

  const handleToggleLike = () => {
    if (isLoading || isCheckingLikeStatus) return;
    toggleLikeMutation.mutate();
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleToggleLike}
        disabled={isLoading || isCheckingLikeStatus}
        className={`gap-2 ${
          isLiked
            ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
            : 'text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${isLoading || isCheckingLikeStatus ? 'opacity-50' : 'hover:scale-105'}`}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isLiked ? 'fill-current' : ''
          } ${isLoading ? 'animate-pulse' : ''}`}
        />
        <span className="text-sm font-medium">{likes}</span>
      </Button>
    </div>
  );
}

export default LikeButton;
