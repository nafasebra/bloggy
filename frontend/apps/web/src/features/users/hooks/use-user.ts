import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/features/users/api/user.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => UserService.getUserById(userId),
  });
}
