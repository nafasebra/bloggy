import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/features/users/api/user.service';
import { queryKeys } from '@/shared/lib/query-keys';
import type { User } from '@/features/users/types';
import { toast } from 'sonner';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
    onError: () => toast.error('Failed to update user'),
  });
}
