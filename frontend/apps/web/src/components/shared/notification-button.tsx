'use client';

import React, { useEffect } from 'react';
import { Bell, ExternalLink, UserPlus, Heart, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.services';
import { useAuth } from '@/contexts/auth-provider';
import { useSocket } from '@/contexts/socket-provider';
import type { Notification } from '@/types';

const typeColors = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const getNotificationTypeColor = (type: 'follow' | 'like' | 'comment') => {
  switch (type) {
    case 'follow':
      return typeColors.success;
    case 'like':
      return typeColors.info;
    case 'comment':
      return typeColors.warning;
    default:
      return typeColors.info;
  }
};

const getNotificationIcon = (type: 'follow' | 'like' | 'comment') => {
  switch (type) {
    case 'follow':
      return <UserPlus className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

function NotificationButton() {
  const { accessToken } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  // Fetch notifications (initial load)
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationService.getNotifications(accessToken),
    enabled: !!accessToken,
  });

  // Fetch unread count (initial load)
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => NotificationService.getUnreadCount(accessToken),
    enabled: !!accessToken,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      NotificationService.markAsRead(notificationId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });

  // WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      queryClient.setQueryData<Notification[]>(['notifications'], (old = []) => {
        // Add new notification at the beginning
        return [notification, ...old];
      });
      
      // Update unread count
      queryClient.setQueryData<number>(['notifications-unread-count'], (old = 0) => old + 1);
    };

    // Listen for unread count updates
    const handleUnreadCount = (count: number) => {
      queryClient.setQueryData<number>(['notifications-unread-count'], count);
    };

    socket.on('new-notification', handleNewNotification);
    socket.on('unread-count', handleUnreadCount);

    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.off('unread-count', handleUnreadCount);
    };
  }, [socket, isConnected, queryClient]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification._id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  if (!accessToken) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {!isConnected && (
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" title="Disconnected" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="h-80 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${getNotificationTypeColor(notification.type)}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-medium text-gray-900 dark:text-white ${
                          !notification.read ? 'font-semibold' : ''
                        }`}
                      >
                        {notification.type === 'follow'
                          ? 'New Follower'
                          : notification.type === 'like'
                            ? 'Post Liked'
                            : 'New Comment'}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(notification.createdAt)}
                      </span>
                      {notification.link && (
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationButton;
