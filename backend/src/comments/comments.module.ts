import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CommentLike } from './entities/comment-like.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike, Post, User]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
