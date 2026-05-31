import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/query-keys';
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
