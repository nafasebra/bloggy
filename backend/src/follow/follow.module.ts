import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    TypeOrmModule.forFeature([User]),
    NotificationsModule,
    AuthModule,
  ],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
