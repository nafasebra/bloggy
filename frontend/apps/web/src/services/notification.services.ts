import http from '@/lib/http';

export interface Notification {
  _id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment';
  relatedUserId: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  relatedPostId?: {
    _id: string;
    title: string;
  };
  relatedCommentId?: {
    _id: string;
    content: string;
  };
  read: boolean;
  message: string;
  link?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface UnreadCountResponse {
  count: number;
}

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
