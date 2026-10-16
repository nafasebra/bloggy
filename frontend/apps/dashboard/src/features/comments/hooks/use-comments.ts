import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/features/comments/api/comment.service';
import { queryKeys } from '@/shared/lib/query-keys';

export function useComments(isUserReady: boolean) {
  return useQuery({
    queryKey: queryKeys.comments.all,
    queryFn: () => commentService.getAllCommentsWithPostTitles(),
    enabled: isUserReady,
  });
}
