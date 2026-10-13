import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostView } from './entities/post-view.entity';
import { AuthModule } from '../auth/auth.module';
import { PostLike } from './entities/post-like.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostView, PostLike, User]),
    AuthModule,
    NotificationsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
