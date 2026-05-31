import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user.services';
import { queryKeys } from '@/constants/key-query';

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: queryKeys.userMe(),
    queryFn: () => UserService.getCurrentUser(),
  });
}
