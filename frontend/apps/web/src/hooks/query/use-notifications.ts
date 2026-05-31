import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.services';
import { queryKeys } from '@/constants/key-query';

export function useNotificationsQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: () => NotificationService.getNotifications(),
    enabled,
  });
}
