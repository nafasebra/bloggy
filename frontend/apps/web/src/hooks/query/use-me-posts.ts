import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.services';
import { queryKeys } from '@/constants/key-query';

export function useUserMePostsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.userMePosts(),
    queryFn: () => PostService.getPostsByUserId(userId as string),
    enabled: !!userId,
  });
}
