import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/features/posts/api/post.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { Post } from '@/features/posts/types';
import { toast } from 'sonner';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Post>) => postService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post created successfuly!');
    },
  });
}
