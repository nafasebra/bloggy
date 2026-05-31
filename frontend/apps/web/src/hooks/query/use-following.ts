import { useQuery } from '@tanstack/react-query';
import http from '@/lib/http';
import { queryKeys } from '@/constants/key-query';
import type { FollowingResponse } from '@/types/follow';

export function useFollowingQuery(userId: string) {
  return useQuery<FollowingResponse>({
    queryKey: queryKeys.following(userId),
    queryFn: async () => {
      const response = await http.get<FollowingResponse>(
        `/users/${userId}/following`
      );
      return response.data;
    },
  });
}
