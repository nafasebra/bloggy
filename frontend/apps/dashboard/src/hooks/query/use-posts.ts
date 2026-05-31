import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { queryKeys } from '@/constants/query-keys';

export function usePosts(enabled = true) {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: () => postService.getAll(),
    enabled,
  });
}
