import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostView, PostViewSchema } from './schemas/post-view.schema';
import { AuthModule } from '../auth/auth.module';
import { PostLike, PostLikeSchema } from './schemas/post-like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostView.name, schema: PostViewSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    AuthModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
