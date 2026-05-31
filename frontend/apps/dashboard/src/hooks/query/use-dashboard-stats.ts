import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { queryKeys } from '@/constants/query-keys';

export function useDashboardStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
