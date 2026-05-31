import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/query-keys';
import type { User } from '@/types';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User created successfully');
    },
    onError: () => toast.error('Failed to create user'),
  });
}
