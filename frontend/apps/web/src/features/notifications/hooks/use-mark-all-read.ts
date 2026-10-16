import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/notification.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationsUnreadCount(),
      });
    },
  });
}
