import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/features/users/api/user.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.userMe(),
    queryFn: () => UserService.getCurrentUser(),
  });
}
