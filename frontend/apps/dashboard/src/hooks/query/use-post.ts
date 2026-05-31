import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { queryKeys } from '@/constants/query-keys';

export function usePost(id?: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id!),
    queryFn: () => postService.getById(id!),
    enabled: !!id,
  });
}
