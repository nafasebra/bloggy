import { useQuery } from '@tanstack/react-query';
import { userService } from '@/features/users/api/user.service';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUser(id?: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  });
}
