import { useQuery } from '@tanstack/react-query';
import { postService } from '@/features/posts/api/post.service';
import { queryKeys } from '@/shared/lib/query-keys';

export function usePosts(enabled = true) {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: () => postService.getAll(),
    enabled,
  });
}
