import { useQuery } from '@tanstack/react-query';
import { PostService } from '@/services/post.services';
import { queryKeys } from '@/constants/key-query';

export function usePostLikedQuery(postId: string) {
  return useQuery({
    queryKey: queryKeys.postLiked(postId),
    queryFn: () => PostService.checkIfPostLiked(postId),
    staleTime: 1000 * 60 * 5,
  });
}
