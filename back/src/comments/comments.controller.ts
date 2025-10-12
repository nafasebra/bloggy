import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import {
  CreateCommentDto,
  ReplyCommentDto,
  LikeCommentDto,
  CommentResponseDto,
  CommentsResponseDto,
  SingleCommentResponseDto,
  ErrorResponseDto,
} from './dto';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to get comments for',
  })
  @ApiResponse({
    status: 200,
    description: 'Comments for the post',
    type: CommentsResponseDto,
  })
  async findCommentsByPostId(
    @Param('postId') postId: string
  ): Promise<Comment[]> {
    return this.commentsService.findByPostId(postId);
  }

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment created',
    type: SingleCommentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createComment(
    @Param('postId') postId: string,
    @Body() comment: CreateCommentDto
  ): Promise<Comment> {
    return this.commentsService.create(postId, comment);
  }

  @Put('reply/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a comment' })
  @ApiBody({ type: ReplyCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Reply created',
    type: SingleCommentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async replyComment(
    @Param('postId') postId: string,
    @Body() comment: ReplyCommentDto
  ): Promise<Comment> {
    return this.commentsService.reply(postId, comment);
  }

  @Put('like/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a comment' })
  @ApiBody({ type: LikeCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comment like toggled',
    type: SingleCommentResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async likeComment(
    @Param('postId') postId: string,
    @Body() comment: LikeCommentDto
  ): Promise<Comment> {
    return this.commentsService.like(postId, comment);
  }
}
