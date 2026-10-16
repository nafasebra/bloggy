import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/features/posts/api/post.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUserPostsQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.userPosts(userId),
    queryFn: () => PostService.getPostsByUserId(userId),
    enabled: enabled && !!userId,
  });
}
