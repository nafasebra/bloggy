import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications/api/notification.services';
import { queryKeys } from '@/shared/lib/query-keys';

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationsUnreadCount(),
      });
    },
  });
}
