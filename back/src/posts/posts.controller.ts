import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Req,
  Ip,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';
import {
  CreatePostDto,
  UpdatePostDto,
  PostResponseDto,
  PostsResponseDto,
  SinglePostResponseDto,
  ErrorResponseDto,
  ViewPostResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LikePostResponseDto } from './dto/like-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'The post has been created.',
    type: SinglePostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    type: ErrorResponseDto,
  })
  async cratePost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by title or category' })
  @ApiResponse({
    status: 200,
    description: 'List of matching posts',
    type: PostsResponseDto,
  })
  async searchPosts(@Query('query') query: string): Promise<PostEntity[]> {
    return this.postsService.findBySearch(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: PostsResponseDto,
  })
  async findAllPosts(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id (without tracking views)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({
    status: 200,
    description: 'The post',
    type: SinglePostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: ErrorResponseDto,
  })
  async findPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: 'The updated post',
    type: SinglePostResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: ErrorResponseDto,
  })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: ErrorResponseDto,
  })
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.delete(id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'View a post (tracks IP-based views)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({
    status: 200,
    description: 'Post viewed successfully',
    type: ViewPostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: ErrorResponseDto,
  })
  async viewPost(
    @Param('id') id: string,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<{ post: PostEntity; isNewView: boolean; message: string }> {
    // Get real IP address (handle proxy/load balancer scenarios)
    const clientIP =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      ip;

    const realIP = Array.isArray(clientIP)
      ? clientIP[0]
      : clientIP.split(',')[0];
    const result = await this.postsService.viewPost(id, realIP);

    return {
      ...result,
      message: result.isNewView
        ? 'View counted'
        : 'Already viewed from this IP',
    };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle like on a post (tracks IP-based likes)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({
    status: 200,
    description: 'Post like toggled successfully',
    type: LikePostResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
    type: ErrorResponseDto,
  })
  async toggleLikePost(
    @Param('id') id: string,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<{ post: PostEntity; isLiked: boolean; message: string }> {
    const clientIP =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      ip;

    const realIP = Array.isArray(clientIP)
      ? clientIP[0]
      : clientIP.split(',')[0];
    const result = await this.postsService.toggleLikePost(id, realIP);
    const isLiked = await this.postsService.checkIfLiked(id, realIP);

    return {
      ...result,
      message: isLiked ? 'liked' : 'unliked',
    };
  }

  @Get(':id/liked')
  @ApiOperation({ summary: 'Check if post is liked by current IP' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({
    status: 200,
    description: 'Like status retrieved',
    schema: { type: 'object', properties: { isLiked: { type: 'boolean' } } },
  })
  async checkIfPostLiked(
    @Param('id') id: string,
    @Ip() ip: string,
    @Req() req: Request
  ): Promise<{ isLiked: boolean }> {
    const clientIP =
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      ip;

    const realIP = Array.isArray(clientIP)
      ? clientIP[0]
      : clientIP.split(',')[0];
    const isLiked = await this.postsService.checkIfLiked(id, realIP);

    return { isLiked };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by user id' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User id' })
  @ApiResponse({
    status: 200,
    description: 'List of posts for the user',
    type: PostsResponseDto,
  })
  async findAllPostsByUserId(
    @Param('userId') userId: string
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId);
  }
}
