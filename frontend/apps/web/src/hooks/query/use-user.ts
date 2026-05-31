import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user.services';
import { queryKeys } from '@/constants/key-query';

export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => UserService.getUserById(userId),
  });
}
