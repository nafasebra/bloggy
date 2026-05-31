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
