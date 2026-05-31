import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/query-keys';
import type { User } from '@/types';
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
