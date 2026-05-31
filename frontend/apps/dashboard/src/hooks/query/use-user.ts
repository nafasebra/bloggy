import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/query-keys';

export function useUser(id?: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  });
}
