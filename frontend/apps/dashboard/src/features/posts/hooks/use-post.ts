import { useQuery } from '@tanstack/react-query';
import { postService } from '@/features/posts/api/post.service';
import { queryKeys } from '@/shared/lib/query-keys';

export function usePost(id?: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id!),
    queryFn: () => postService.getById(id!),
    enabled: !!id,
  });
}
