import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { CreateCommentDtoType, ReplyCommentDtoType, LikeCommentDtoType } from './dto';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'ID of the post to get comments for' })
  @ApiResponse({ status: 200, description: 'Comments for the post', type: [Comment] })
  async findCommentsByPostId(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentsService.findByPostId(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ type: CreateCommentDtoType })
  @ApiResponse({ status: 201, description: 'Comment created', type: Comment })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createComment(@Body() comment: CreateCommentDtoType): Promise<Comment> {
    return this.commentsService.create(comment);
  }

  @Post('reply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a comment' })
  @ApiBody({ type: ReplyCommentDtoType })
  @ApiResponse({ status: 201, description: 'Reply created', type: Comment })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async replyComment(@Body() comment: ReplyCommentDtoType): Promise<Comment> {
    return this.commentsService.reply(comment);
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a comment' })
  @ApiBody({ type: LikeCommentDtoType })
  @ApiResponse({ status: 200, description: 'Comment like toggled', type: Comment })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async likeComment(@Body() comment: LikeCommentDtoType): Promise<Comment> {
    return this.commentsService.like(comment);
  }
}
