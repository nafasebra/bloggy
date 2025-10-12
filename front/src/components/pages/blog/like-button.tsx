"use client"

import { Heart } from 'lucide-react'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PostService } from '@/services/post.services'

interface LikeButtonProps {
    postId: string;
    initialLikes?: number;
}

function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
    const [feedback, setFeedback] = React.useState<string>('');
    const queryClient = useQueryClient();

    // Query to check if the post is liked
    const { data: likeStatus, isLoading: isCheckingLikeStatus } = useQuery({
        queryKey: ['postLiked', postId],
        queryFn: () => PostService.checkIfPostLiked(postId),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Mutation to toggle like
    const toggleLikeMutation = useMutation({
        mutationFn: () => PostService.toggleLikePost(postId),
        onSuccess: (response) => {
            queryClient.setQueryData(['postLiked', postId], { isLiked: response.isLiked });
            
            if (response.message === 'liked') {
                setFeedback('Liked!');
            } else {
                setFeedback('Unliked');
            }
            
            setTimeout(() => setFeedback(''), 2000);
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
        onError: (error) => {
            console.error('Error toggling like:', error);
            setFeedback('Failed');
            setTimeout(() => setFeedback(''), 2000);
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
            {feedback && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-md whitespace-nowrap z-10 shadow-lg">
                    {feedback}
                </div>
            )}
        </div>
    )
}

export default LikeButton
