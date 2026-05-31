import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { queryKeys } from '@/constants/query-keys';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}
