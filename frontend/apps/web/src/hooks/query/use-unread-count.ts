import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.services';
import { queryKeys } from '@/constants/key-query';

export function useNotificationsUnreadCountQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.notificationsUnreadCount(),
    queryFn: () => NotificationService.getUnreadCount(),
    enabled,
  });
}
