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
  static async getNotifications(
    accessToken: string | null
  ): Promise<Notification[]> {
    const response = await http.get<NotificationsResponse>('/notifications', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.notifications;
  }

  static async markAsRead(
    notificationId: string,
    accessToken: string | null
  ): Promise<Notification> {
    const response = await http.put<Notification>(
      `/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  static async markAllAsRead(
    accessToken: string | null
  ): Promise<void> {
    await http.put(
      '/notifications/read-all',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  static async getUnreadCount(
    accessToken: string | null
  ): Promise<number> {
    const response = await http.get<UnreadCountResponse>(
      '/notifications/unread-count',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.count;
  }
}

