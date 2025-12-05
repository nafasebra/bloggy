import {
  Controller,
  Post,
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
  @ApiOperation({ summary: 'Follow or unfollow a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID to follow/unfollow',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Follow relationship toggled successfully',
    schema: { example: { isFollowing: true } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cannot follow yourself',
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

  /**
   * Get list of followers for a user
   * GET /users/:id/followers
   */
  @Get(':id/followers')
  @ApiOperation({ summary: 'Get list of followers for a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Followers list retrieved successfully',
    schema: {
      example: {
        followers: [
          {
            _id: '507f1f77bcf86cd799439010',
            name: 'John Doe',
            bio: 'Software developer',
            avatar: 'avatar_url',
            email: 'john@example.com',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getFollowers(@Param('id') userId: string) {
    const followers = await this.followService.getFollowers(userId);
    return { followers };
  }

  /**
   * Get list of users that a user is following
   * GET /users/:id/following
   */
  @Get(':id/following')
  @ApiOperation({ summary: 'Get list of users that a user is following' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Following list retrieved successfully',
    schema: {
      example: {
        following: [
          {
            _id: '507f1f77bcf86cd799439012',
            name: 'Jane Smith',
            bio: 'Product designer',
            avatar: 'avatar_url',
            email: 'jane@example.com',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getFollowing(@Param('id') userId: string) {
    const following = await this.followService.getFollowing(userId);
    return { following };
  }
}
