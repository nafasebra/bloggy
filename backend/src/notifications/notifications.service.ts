import { serializeRelations } from '../common/serialize-relations';
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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
    relatedPostId?: string,
    relatedCommentId?: string
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      relatedUserId,
      relatedPostId,
      relatedCommentId,
      message,
      link,
    });
    const savedNotification =
      await this.notificationRepository.save(notification);

    // Populate related data for WebSocket emission
    const populatedNotification = await this.notificationRepository.findOne({
      where: { _id: savedNotification._id },
      relations: { relatedUser: true, relatedPost: true, relatedComment: true },
    });

    // Emit notification via WebSocket
    if (populatedNotification && this.notificationsGateway) {
      this.notificationsGateway.emitNotification(
        userId,
        serializeRelations(populatedNotification, {
          relatedUser: 'relatedUserId',
          relatedPost: 'relatedPostId',
          relatedComment: 'relatedCommentId',
        })
      );

      // Update unread count
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }

    return savedNotification;
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository
      .find({
        where: { userId },
        relations: {
          relatedUser: true,
          relatedPost: true,
          relatedComment: true,
        },
        order: { createdAt: 'DESC' },
      })
      .then(items =>
        items.map(item =>
          serializeRelations(item, {
            relatedUser: 'relatedUserId',
            relatedPost: 'relatedPostId',
            relatedComment: 'relatedCommentId',
          })
        )
      );
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    const savedNotification =
      await this.notificationRepository.save(notification);

    // Update unread count via WebSocket
    if (this.notificationsGateway) {
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }

    return savedNotification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    );

    // Update unread count via WebSocket
    if (this.notificationsGateway) {
      const unreadCount = await this.getUnreadCount(userId);
      this.notificationsGateway.emitUnreadCount(userId, unreadCount);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countBy({ userId, read: false });
  }
}
