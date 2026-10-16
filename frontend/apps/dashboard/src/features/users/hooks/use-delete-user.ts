import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/features/users/api/user.service';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });
}
