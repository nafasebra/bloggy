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
  ForbiddenException,
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
import { getClientIp } from '../common/http/get-client-ip';
import { toObjectIdString } from '../common/mongo/to-object-id-string';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username?: string;
  };
}

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
    @Body() comment: CreateCommentDto,
    @Req() req: AuthenticatedRequest
  ): Promise<Comment> {
    return this.commentsService.create(postId, {
      ...comment,
      authorId: req.user.userId,
      authorName: req.user.username ?? comment.authorName,
    });
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
    @Body() comment: ReplyCommentDto,
    @Req() req: AuthenticatedRequest
  ): Promise<Comment> {
    return this.commentsService.reply(postId, {
      ...comment,
      authorId: req.user.userId,
      authorName: req.user.username ?? comment.authorName,
    });
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
    return this.commentsService.like(commentId, getClientIp(req, ip));
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
    const isLiked = await this.commentsService.checkIfLiked(
      commentId,
      getClientIp(req, ip)
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
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthenticatedRequest
  ): Promise<{ message: string }> {
    const comment = await this.commentsService.findById(commentId);
    if (toObjectIdString(comment.authorId) !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentsService.delete(commentId);
    return { message: 'Comment deleted successfully' };
  }
}
