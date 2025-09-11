import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateCommentDtoType, ReplyCommentDtoType } from './dto';
import { CommentsService } from './comments.service';
import { LikeCommentDtoType } from './dto';
import { Comment } from './schemas/comment.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() comment: CreateCommentDtoType): Promise<Comment> {
    return this.commentsService.create(comment);
  }

  @Post('reply')
  @UseGuards(JwtAuthGuard)
  async replyComment(@Body() comment: ReplyCommentDtoType): Promise<Comment> {
    return this.commentsService.reply(comment);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeComment(@Body() comment: LikeCommentDtoType): Promise<Comment> {
    return this.commentsService.like(comment);
  }
}
