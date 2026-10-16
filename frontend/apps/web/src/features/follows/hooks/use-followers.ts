import { useQuery } from '@tanstack/react-query';
import http from '@repo/http-client/web';
import { queryKeys } from '@/shared/lib/query-keys';
import type { FollowersResponse } from '@/features/follows/types';

export function useFollowersQuery(userId: string) {
  return useQuery<FollowersResponse>({
    queryKey: queryKeys.followers(userId),
    queryFn: async () => {
      const response = await http.get<FollowersResponse>(
        `/users/${userId}/followers`
      );
      return response.data;
    },
  });
}
