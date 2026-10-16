import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/features/posts/api/post.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUserMePostsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.userMePosts(),
    queryFn: () => PostService.getPostsByUserId(userId as string),
    enabled: !!userId,
  });
}
