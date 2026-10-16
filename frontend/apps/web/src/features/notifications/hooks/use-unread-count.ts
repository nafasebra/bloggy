import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/notification.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useNotificationsUnreadCountQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.notificationsUnreadCount(),
    queryFn: () => NotificationService.getUnreadCount(),
    enabled,
  });
}
