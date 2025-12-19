import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CommentsModule,
    PostsModule,
    AuthModule,
    FollowModule,
    NotificationsModule,
  ],
})
export class AppModule {}
