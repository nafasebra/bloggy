import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/features/comments/api/comment.services';
import { queryKeys } from '@/shared/lib/query-keys';
import type { CreateCommentData } from '@/features/comments/types';
import { toast } from 'sonner';

export function useReplyToCommentMutation(
  postId: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) =>
      CommentService.replyToComment(data, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      options?.onSuccess?.();
      toast.success('Reply posted successfully!');
    },
    onError: () => {
      toast.error('Failed to post reply');
    },
  });
}
