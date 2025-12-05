import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    CommentsModule,
    PostsModule,
    AuthModule,
    FollowModule,
  ],
})
export class AppModule {}
