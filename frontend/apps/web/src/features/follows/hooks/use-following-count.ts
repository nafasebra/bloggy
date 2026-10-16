import { useQuery } from '@tanstack/react-query';
import http from '@repo/http-client/web';
import { queryKeys } from '@/shared/lib/query-keys';
import type { FollowingCountResponse } from '@/features/follows/types';

export function useFollowingCountQuery(userId: string) {
  return useQuery<FollowingCountResponse>({
    queryKey: queryKeys.followingCount(userId),
    queryFn: async () => {
      const response = await http.get<FollowingCountResponse>(
        `/users/${userId}/following-count`
      );
      return response.data;
    },
  });
}
