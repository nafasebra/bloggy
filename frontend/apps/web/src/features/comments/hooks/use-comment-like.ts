import { useQuery } from '@tanstack/react-query';
import { CommentService } from '@/features/comments/api/comment.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useCommentLikeQuery(commentId: string) {
  return useQuery({
    queryKey: queryKeys.commentLike(commentId),
    queryFn: () => CommentService.checkIfCommentLiked(commentId),
    enabled: !!commentId,
  });
}
