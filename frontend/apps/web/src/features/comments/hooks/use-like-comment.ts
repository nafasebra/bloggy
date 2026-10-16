import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/features/comments/api/comment.services';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function useToggleCommentLikeMutation(
  commentId: string,
  postId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CommentService.toggleLikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commentLike(commentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
    },
    onError: () => {
      toast.error('Failed to like comment');
    },
  });
}
