import { Controller, Post, Body } from '@nestjs/common';
import { CreateCommentDtoType, ReplyCommentDtoType } from './dto';
import { CommentsService } from './comments.service';
import { LikeCommentDtoType } from './dto';
import { Comment } from './schemas/comment.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() comment: CreateCommentDtoType): Promise<Comment> {
    return this.commentsService.create(comment);
  }

  @Post('reply')
  async replyComment(@Body() comment: ReplyCommentDtoType): Promise<Comment> {
    return this.commentsService.reply(comment);
  }

  @Post('like')
  async likeComment(@Body() comment: LikeCommentDtoType): Promise<Comment> {
    return this.commentsService.like(comment);
  }
}
