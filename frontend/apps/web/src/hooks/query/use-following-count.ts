import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { queryKeys } from '@/constants/key-query';
import type { FollowingCountResponse } from '@/types/follow';

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
