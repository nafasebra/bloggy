import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/notification.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useNotificationsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: () => NotificationService.getNotifications(),
    enabled,
  });
}
