import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { queryKeys } from '@/shared/lib/query-keys';
import { removeUserAvatar, uploadUserAvatar } from '../lib/avatar';

export function useProfilePhotoMutation(userId: string) {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: (file: File | null) =>
      file ? uploadUserAvatar(userId, file) : removeUserAvatar(userId),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.userMe(), user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.userMe() });
    },
  });
}
