import { useQuery } from '@tanstack/react-query';
import { commentService } from '@/services/comment.service';

export const useComments = (isUserReady: boolean) => {
  return useQuery({
    queryKey: ['comments'],
    queryFn: () => commentService.getAllCommentsWithPostTitles(),
    enabled: isUserReady,
  });
};
