import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { queryKeys } from '@/constants/key-query';
import type { FollowersResponse } from '@/types/follow';

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
