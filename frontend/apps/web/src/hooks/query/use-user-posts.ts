import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.services';
import { queryKeys } from '@/constants/key-query';

export function useUserPostsQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.userPosts(userId),
    queryFn: () => PostService.getPostsByUserId(userId),
    enabled: enabled && !!userId,
  });
}
