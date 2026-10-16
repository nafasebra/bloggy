import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/features/comments/api/comment.service';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });
}
