import http from '@/lib/http';
import type {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
} from '@/types/notification';

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    const response = await http.get<NotificationsResponse>('/notifications');
    return response.data.notifications;
  }

  static async markAsRead(notificationId: string): Promise<Notification> {
    const response = await http.put<Notification>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  }

  static async markAllAsRead(): Promise<void> {
    await http.put('/notifications/read-all');
  }

  static async getUnreadCount(): Promise<number> {
    const response = await http.get<UnreadCountResponse>(
      '/notifications/unread-count'
    );
    return response.data.count;
  }
}
