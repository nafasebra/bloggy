import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/features/posts/api/post.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function usePostLikedQuery(postId: string) {
  return useQuery({
    queryKey: queryKeys.postLiked(postId),
    queryFn: () => PostService.checkIfPostLiked(postId),
    staleTime: 1000 * 60 * 5,
  });
}
