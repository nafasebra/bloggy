import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.services';
import { queryKeys } from '@/constants/key-query';
import type { CreateCommentData } from '@/types/comment';
import { toast } from 'sonner';

export function useCreateCommentMutation(
  postId: string,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) =>
      CommentService.createComment(data, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
      options?.onSuccess?.();
      toast.success('Comment posted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create comment: ' + error);
    },
  });
}
