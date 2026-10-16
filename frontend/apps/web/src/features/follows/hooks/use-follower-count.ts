import { useQuery } from '@tanstack/react-query';
import http from '@repo/http-client/web';
import { queryKeys } from '@/shared/lib/query-keys';
import type { FollowerCountResponse } from '@/features/follows/types';

export function useFollowerCountQuery(userId: string) {
  return useQuery<FollowerCountResponse>({
    queryKey: queryKeys.followerCount(userId),
    queryFn: async () => {
      const response = await http.get<FollowerCountResponse>(
        `/users/${userId}/follower-count`
      );
      return response.data;
    },
  });
}
