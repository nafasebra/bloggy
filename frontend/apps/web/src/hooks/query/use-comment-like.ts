import { useQuery } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.services';
import { queryKeys } from '@/constants/key-query';

export function useCommentLikeQuery(commentId: string) {
  return useQuery({
    queryKey: queryKeys.commentLike(commentId),
    queryFn: () => CommentService.checkIfCommentLiked(commentId),
    enabled: !!commentId,
  });
}
