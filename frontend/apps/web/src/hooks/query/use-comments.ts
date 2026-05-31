import { useQuery } from '@tanstack/react-query';
import { CommentService } from '@/services/comment.services';
import { queryKeys } from '@/constants/key-query';
import type { CommentWithAuthor } from '@/types/comment';

export function useCommentsQuery(postId: string) {
  return useQuery<CommentWithAuthor[]>({
    queryKey: queryKeys.comments(postId),
    queryFn: () => CommentService.getCommentsByPostId(postId),
    enabled: !!postId,
  });
}
