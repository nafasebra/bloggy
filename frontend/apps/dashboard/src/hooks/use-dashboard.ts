// src/hooks/use-dashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboardStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    enabled, // فقط زمانی که کاربر لاگین است ریکوئست زده شود
    staleTime: 5 * 60 * 1000, // کش کردن داده‌ها برای ۵ دقیقه جهت جلوگیری از فشار به سرور
  });
};
