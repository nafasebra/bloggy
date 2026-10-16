import { useQuery } from '@tanstack/react-query';
import { CommentService } from '@/features/comments/api/comment.services';
import { queryKeys } from '@/shared/lib/query-keys';
import type { CommentWithAuthor } from '@/features/comments/types';

export function useCommentsQuery(postId: string) {
  return useQuery<CommentWithAuthor[]>({
    queryKey: queryKeys.comments(postId),
    queryFn: () => CommentService.getCommentsByPostId(postId),
    enabled: !!postId,
  });
}
