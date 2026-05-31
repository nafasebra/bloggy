import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.services';
import { queryKeys } from '@/constants/key-query';

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
