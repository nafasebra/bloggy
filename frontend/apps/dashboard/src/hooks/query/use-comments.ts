import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/services/comment.service';
import { queryKeys } from '@/constants/query-keys';

export function useComments(isUserReady: boolean) {
  return useQuery({
    queryKey: queryKeys.comments.all,
    queryFn: () => commentService.getAllCommentsWithPostTitles(),
    enabled: isUserReady,
  });
}
