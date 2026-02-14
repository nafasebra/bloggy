'use client';

import { useAuth } from '@/contexts/auth-provider';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CommentCard from '@/components/shared/comment-card';
import { CommentWithAuthor, CreateCommentData } from '@/types';
import { CommentService } from '@/services/comment.services';
import { Button } from '@repo/ui/button';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import { Card, CardContent } from '@repo/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: string;
}

// Zod schema for comment validation
const commentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Comment is required')
    .max(1000, 'Comment must be less than 1000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function CommentSection({ postId }: CommentSectionProps) {
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentWithAuthor[]>({
    queryKey: ['comments', postId],
    queryFn: () => CommentService.getCommentsByPostId(postId),
    enabled: !!postId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: CreateCommentData) =>
      CommentService.createComment(data, postId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      reset();
      toast.success('Comment posted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create comment: ' + error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
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

      {accessToken ? (
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

          <Button
            type="submit"
            disabled={createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 flex flex-col gap-3 border border-gray-300 dark:border-gray-600 py-5 px-3 rounded-lg text-center items-center justify-center ">
          <p>Please login to write your thoughts</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6 mt-9">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <div  key={comment._id} className={comment.parentId ? 'ml-4 sm:ml-10' : ''}>
              <CommentCard comment={comment} />
            </div>
          ))
        )}
      </div>

      {!isLoading && comments.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
      </CardContent>
    </Card>
  );
}
