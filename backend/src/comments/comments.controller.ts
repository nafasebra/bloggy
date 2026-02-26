import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Req,
  Ip,
  Delete,
} from '@nestjs/common';
import {
  CreateCommentDto,
  ReplyCommentDto,
  CommentsResponseDto,
  SingleCommentResponseDto,
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
import { Request } from 'express';

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

  @Put(':commentId/like')
  @ApiOperation({ summary: 'Like or unlike a comment' })
  @ApiParam({ name: 'commentId', type: 'string', description: 'Comment id' })
  @ApiResponse({
    status: 200,
    description: 'Comment like toggled',
    type: SingleCommentResponseDto,
  })
  async likeComment(
    @Param('commentId') commentId: string,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<Comment> {
    const clientIP =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      ip;

    return this.commentsService.like(commentId, clientIP);
  }

  // get state of like
  @Get(':commentId/like')
  @ApiOperation({ summary: 'Check if user has liked a comment' })
  @ApiParam({ name: 'commentId', type: 'string', description: 'Comment id' })
  @ApiResponse({
    status: 200,
    description: 'Like state retrieved',
    schema: { type: 'object', properties: { isLiked: { type: 'boolean' } } },
  })
  async checkIfLiked(
    @Param('commentId') commentId: string,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<{ isLiked: boolean }> {
    const clientIP =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      ip;

    const isLiked = await this.commentsService.checkIfLiked(
      commentId,
      clientIP
    );

    return { isLiked };
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment by id' })
  @ApiParam({ name: 'commentId', type: 'string', description: 'Comment id' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  async deleteComment(@Param('commentId') commentId: string): Promise<{ message: string }> {
    await this.commentsService.delete(commentId);
    return { message: 'Comment deleted successfully' };
  }
}
