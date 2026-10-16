import { useQuery } from '@tanstack/react-query';
import http from '@repo/http-client/web';
import { queryKeys } from '@/shared/lib/query-keys';
import type { FollowingResponse } from '@/features/follows/types';

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
