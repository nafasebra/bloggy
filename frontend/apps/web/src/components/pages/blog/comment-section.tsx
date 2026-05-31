'use client';

import { useAuth } from '@/contexts/auth-provider';
import { LoginPrompt } from '@/components/shared/login-prompt';
import { EmptyState } from '@/components/ui/empty-state';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CommentCard from '@/components/shared/comment-card';
import { Button } from '@repo/ui/button';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import { Card, CardContent } from '@repo/ui/card';
import { MessageCircle } from 'lucide-react';
import { useCommentsQuery } from '@/hooks/query';
import { useCreateCommentMutation } from '@/hooks/mutation';

interface CommentSectionProps {
  postId: string;
}

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Comment is required')
    .max(1000, 'Comment must be less than 1000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const { data: comments = [], isLoading } = useCommentsQuery(postId);
  const createCommentMutation = useCreateCommentMutation(postId, {
    onSuccess: reset,
  });

  const onSubmit = (data: CommentFormData) => {
    if (user) {
      createCommentMutation.mutate({
        content: data.comment,
        postId,
        authorId: user._id,
        authorName: user.name,
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h3>

        {user?._id ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                rows={4}
                {...register('comment')}
                placeholder="Share your thoughts..."
                className="resize-none"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment.message}</p>
              )}
            </div>

            <Button type="submit" disabled={createCommentMutation.isPending}>
              {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <LoginPrompt message="Please login to write your thoughts" />
        )}

        <div className="space-y-6 mt-9">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className={comment.parentId ? 'ml-4 sm:ml-10' : ''}
              >
                <CommentCard comment={comment} />
              </div>
            ))
          )}
        </div>

        {!isLoading && comments.length === 0 && (
          <EmptyState
            icon={<MessageCircle className="w-8 h-8 text-gray-400" />}
            title="No comments yet. Be the first to share your thoughts!"
            className="py-8"
          />
        )}
      </CardContent>
    </Card>
  );
}
