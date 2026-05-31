import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.services';
import { queryKeys } from '@/constants/key-query';

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
