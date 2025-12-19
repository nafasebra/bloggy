import { Injectable, Inject, forwardRef, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schemas/notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @Optional()
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway?: NotificationsGateway
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    relatedUserId: string,
    message: string,
    link?: string,
    relatedPostId?: string
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      userId,
      type,
      relatedUserId,
      relatedPostId,
      message,
      link,
    });
    const savedNotification = await notification.save();

    // Populate related data for WebSocket emission
    const populatedNotification = await this.notificationModel
      .findById(savedNotification._id)
      .populate('relatedUserId', 'name username avatar')
      .populate('relatedPostId', 'title')
      .exec();

    // Emit notification via WebSocket
    if (populatedNotification && this.notificationsGateway) {
      this.notificationsGateway.emitNotification(
        userId,
        populatedNotification.toObject()
      );

      // Update unread count
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }

    return savedNotification;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId })
      .populate('relatedUserId', 'name username avatar')
      .populate('relatedPostId', 'title')
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification> {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    const savedNotification = await notification.save();

    // Update unread count via WebSocket
    if (this.notificationsGateway) {
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }

    return savedNotification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany({ userId, read: false }, { read: true })
      .exec();

    // Update unread count via WebSocket
    if (this.notificationsGateway) {
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({ userId, read: false });
  }
}
