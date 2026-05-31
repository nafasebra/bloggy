import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { queryKeys } from '@/constants/key-query';
import type { FollowerCountResponse } from '@/types/follow';

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
