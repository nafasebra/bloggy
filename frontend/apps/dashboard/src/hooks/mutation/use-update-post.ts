import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { queryKeys } from '@/constants/query-keys';
import type { Post } from '@/types';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      postService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.id),
      });
    },
  });
}
