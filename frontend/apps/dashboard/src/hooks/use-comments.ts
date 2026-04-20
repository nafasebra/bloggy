import { useMutation } from '@tanstack/react-query';
import { commentService } from '@/services/comment.service';
import { toast } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { useQuery } from '@tanstack/react-query';

export const useComments = (isUserReady: boolean) => {
  return useQuery({
    queryKey: ['comments'],
    queryFn: () => commentService.getAllCommentsWithPostTitles(),
    enabled: isUserReady,
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });
};
