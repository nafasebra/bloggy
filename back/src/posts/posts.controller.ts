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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto, PostResponseDto, PostsResponseDto, SinglePostResponseDto, ErrorResponseDto } from './dto';
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

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'The post has been created.', type: SinglePostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input', type: ErrorResponseDto })
  async cratePost(
    @Body() createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by title' })
  @ApiResponse({ status: 200, description: 'List of matching posts', type: PostsResponseDto })
  async searchPosts(@Query('query') query: string): Promise<PostEntity[]> {
    return this.postsService.findBySearch(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of posts', type: PostsResponseDto })
  async findAllPosts(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiResponse({ status: 200, description: 'The post', type: SinglePostResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found', type: ErrorResponseDto })
  async findPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiBody({ type: UpdatePostDto  })
  @ApiResponse({ status: 200, description: 'The updated post', type: SinglePostResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found', type: ErrorResponseDto })
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
  @ApiResponse({ status: 404, description: 'Post not found', type: ErrorResponseDto })
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.delete(id);
  }

  @Get('debug')
  @ApiOperation({ summary: 'Debug endpoint to show post data structure' })
  async debugPosts(): Promise<any> {
    const posts = await this.postsService.findAll();
    return {
      totalCount: posts.length,
      samplePost: posts.length > 0 ? posts[0] : null,
      titles: posts.slice(0, 5).map(p => p.title),
      authors: posts.slice(0, 5).map(p => p.authorName),
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by user id' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User id' })
  @ApiResponse({ status: 200, description: 'List of posts for the user', type: PostsResponseDto })
  async findAllPostsByUserId(
    @Param('userId') userId: string
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId);
  }
}
