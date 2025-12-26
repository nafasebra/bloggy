'use client';

import { Heart } from 'lucide-react';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/services/post.services';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-provider';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
}

function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  // Query to check if the post is liked
  const { data: likeStatus, isLoading: isCheckingLikeStatus } = useQuery({
    queryKey: ['postLiked', postId],
    queryFn: () => PostService.checkIfPostLiked(postId, accessToken),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Mutation to toggle like
  const toggleLikeMutation = useMutation({
    mutationFn: () => PostService.toggleLikePost(postId, accessToken),
    onSuccess: (response) => {
      queryClient.setQueryData(['postLiked', postId], {
        isLiked: response.isLiked,
      });

      if (response.message === 'liked') {
        toast.success('Liked!');
      } else {
        toast.success('Unliked');
      }

      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error) => {
      toast.error('Failed to toggle like');
    },
  });

  const isLiked = likeStatus?.isLiked ?? false;
  const likes = toggleLikeMutation.data?.post.likes ?? initialLikes;
  const isLoading = toggleLikeMutation.isPending;

  const handleToggleLike = () => {
    if (isLoading || isCheckingLikeStatus) return;
    toggleLikeMutation.mutate();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleLike}
        disabled={isLoading || isCheckingLikeStatus}
        className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
          isLiked
            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
            : 'text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${isLoading || isCheckingLikeStatus ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isLiked ? 'fill-current' : ''
          } ${isLoading ? 'animate-pulse' : ''}`}
        />
        <span className="text-sm font-medium">{likes}</span>
      </button>
    </div>
  );
}

export default LikeButton;
