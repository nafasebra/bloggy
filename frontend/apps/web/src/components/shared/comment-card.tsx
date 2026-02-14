import React, { useState } from 'react';
import Link from 'next/link';
import { CommentWithAuthor } from '@/types';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.services';
import { UserService } from '@/services/user.services';
import { toast } from 'sonner';

interface CommentCardProps {
  comment: CommentWithAuthor;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
}) => {
  const [isReply, setIsReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: ['comment-like', comment._id],
    queryFn: () => CommentService.checkIfCommentLiked(comment._id),
    enabled: !!comment._id,
  });

  const likeMutation = useMutation({
    mutationFn: () => CommentService.toggleLikeComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment-like', comment._id] });
      queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
    },
    onError: (error) => {
      toast.error('Failed to like comment');
    },
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const user = await UserService.getCurrentUser(accessToken!);
      const replyData = {
        content: replyText,
        authorId: user._id,
        authorName: user.name,
        postId: comment.postId,
        parentId: comment._id,
      };
      return CommentService.replyToComment(replyData, comment.postId, accessToken);
    },
    onSuccess: () => {
      setReplyText('');
      setIsReply(false);
      queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
      toast.success('Reply posted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to post reply');
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleReply = () => {
    if (!accessToken) {
      toast.error('You must be logged in to reply');
      return;
    }
    if (!replyText.trim()) return;
    replyMutation.mutate();
  };

  return (
    <div key={comment._id} className="flex space-x-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-medium">
          {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {comment.author?.name || 'Anonymous'}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {comment.content}
        </p>

        <div className="flex items-center space-x-4 mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsReply(!isReply)}
            className={`cursor-pointer text-xs h-auto py-0 px-0 ${
              isReply
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Reply
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`cursor-pointer text-xs h-auto py-0 px-0 ${
              likeStatus?.isLiked
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
            } flex items-center`}
          >
            <Heart
              className="mr-1"
              size={16}
              fill={likeStatus?.isLiked ? 'red' : 'none'}
              color={likeStatus?.isLiked ? 'red' : 'currentColor'}
            />
            {likeMutation.isPending ? 'Liking...' : `Like (${comment.likes || 0})`}
          </Button>
        </div>

        {/* Reply Input */}
        {isReply && (
          <>
            {accessToken ? (
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add a reply..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleReply}
                  disabled={replyMutation.isPending}
                >
                  {replyMutation.isPending ? 'Replying...' : 'Reply'}
                </Button>
              </div>
            ) : (
              <div className="text-center mt-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You should be logged in to reply.
                </p>
                <Link href="/auth/login">
                  <Button type="button" size="sm" className="mt-2">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
