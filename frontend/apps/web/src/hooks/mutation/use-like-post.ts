import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/services/post.services';
import { queryKeys } from '@/constants/key-query';
import { toast } from 'sonner';

export function useTogglePostLikeMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PostService.toggleLikePost(postId),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.postLiked(postId), {
        isLiked: response.isLiked,
      });

      if (response.message === 'liked') {
        toast.success('Liked!');
      } else {
        toast.success('Unliked');
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
    onError: () => {
      toast.error('Failed to toggle like');
    },
  });
}
