import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Post]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
    }),
  ],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
