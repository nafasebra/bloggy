import {
  Controller,
  Post,
  Delete,
  Patch,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Follow')
@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * Toggle follow/unfollow a user
   * POST /users/:id/follow
   */
  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user or toggle follow status' })
  @ApiParam({
    name: 'id',
    description: 'User ID to follow',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'Follow relationship created successfully',
    schema: { example: { isFollowing: true } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cannot follow yourself or already following',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.OK)
  async toggleFollow(@Param('id') followingId: string, @Request() req: any) {
    return this.followService.toggleFollow(req.user.userId, followingId);
  }

  /**
   * Get all followers of a user
   * GET /users/:id/followers
   */
  @Get(':id/followers')
  @ApiOperation({ summary: 'Get all followers of a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Followers retrieved successfully',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          followerId: {
            _id: '507f1f77bcf86cd799439012',
            name: 'John Doe',
            username: 'johndoe',
            avatar: 'https://example.com/avatar.jpg',
            bio: 'Software developer',
          },
          followingId: '507f1f77bcf86cd799439011',
          createdAt: '2025-12-05T10:00:00Z',
        },
      ],
    },
  })
  async getFollowers(@Param('id') userId: string) {
    const followers = await this.followService.getFollowers(userId);
    return {
      count: followers.length,
      data: followers,
    };
  }

  /**
   * Get all users that a user is following
   * GET /users/:id/following
   */
  @Get(':id/following')
  @ApiOperation({ summary: 'Get all users that a user is following' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Following list retrieved successfully',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439012',
          followerId: '507f1f77bcf86cd799439011',
          followingId: {
            _id: '507f1f77bcf86cd799439013',
            name: 'Jane Smith',
            username: 'janesmith',
            avatar: 'https://example.com/avatar2.jpg',
            bio: 'Designer',
          },
          createdAt: '2025-12-05T10:00:00Z',
        },
      ],
    },
  })
  async getFollowing(@Param('id') userId: string) {
    const following = await this.followService.getFollowing(userId);
    return {
      count: following.length,
      data: following,
    };
  }

  /**
   * Get follower count for a user
   * GET /users/:id/follower-count
   */
  @Get(':id/follower-count')
  @ApiOperation({ summary: 'Get follower count for a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Follower count retrieved successfully',
    schema: { example: { count: 42 } },
  })
  async getFollowerCount(@Param('id') userId: string) {
    const count = await this.followService.getFollowerCount(userId);
    return { count };
  }

  /**
   * Get following count for a user
   * GET /users/:id/following-count
   */
  @Get(':id/following-count')
  @ApiOperation({ summary: 'Get following count for a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Following count retrieved successfully',
    schema: { example: { count: 15 } },
  })
  async getFollowingCount(@Param('id') userId: string) {
    const count = await this.followService.getFollowingCount(userId);
    return { count };
  }

  /**
   * Check if current user is following a target user
   * GET /users/:id/is-following/:targetId
   */
  @Get(':id/is-following/:targetId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiParam({
    name: 'id',
    description: 'Follower user ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiParam({
    name: 'targetId',
    description: 'User ID being checked if followed',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow status retrieved successfully',
    schema: { example: { isFollowing: true } },
  })
  async isFollowing(
    @Param('id') userId: string,
    @Param('targetId') targetId: string
  ) {
    return this.followService.isFollowing(userId, targetId);
  }
}
