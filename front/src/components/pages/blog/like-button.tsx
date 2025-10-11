"use client"

import { Heart } from 'lucide-react'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { PostService } from '@/services/post.services'

interface LikeButtonProps {
    postId: string;
    initialLikes?: number;
}

function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
    const [likes, setLikes] = React.useState(initialLikes);
    const [isLiked, setIsLiked] = React.useState(false);
    const [feedback, setFeedback] = React.useState<string>('');

    // Update likes when initialLikes changes
    React.useEffect(() => {
        setLikes(initialLikes);
    }, [initialLikes]);

    const likeMutation = useMutation({
        mutationFn: () => PostService.likePost(postId),
        onSuccess: (response) => {
            if (response.isNewLike) {
                setLikes(response.post.likes || 0);
                setIsLiked(true);
                setFeedback('Liked!');
            } else {
                setFeedback('Already liked');
            }
            setTimeout(() => setFeedback(''), 2000);
        },
        onError: (error) => {
            console.error('Error liking post:', error);
            setFeedback('Failed to like');
            setTimeout(() => setFeedback(''), 2000);
        },
    });

    const handleLike = () => {
        if (likeMutation.isPending) return;
        likeMutation.mutate();
    };

    return (
        <div className="relative">
            <button 
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                    isLiked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${likeMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
                <Heart 
                    className={`w-4 h-4 transition-all duration-200 ${
                        isLiked ? 'fill-current' : ''
                    } ${likeMutation.isPending ? 'animate-pulse' : ''}`} 
                />
                <span className="text-sm font-medium">{likes}</span>
            </button>
            {feedback && (
                <div className="absolute -top-6 right-0 ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-md whitespace-nowrap z-10">
                    {feedback}
                </div>
            )}
        </div>
    )
}

export default LikeButton
