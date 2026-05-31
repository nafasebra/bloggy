import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/query-keys';

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => userService.getAll(),
    enabled,
  });
}
