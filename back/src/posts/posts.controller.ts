import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiParam,
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
  @ApiCreatedResponse({ description: 'The post has been created.', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async cratePost(
    @Body() createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({ description: 'List of posts', type: [PostEntity] })
  async findAllPosts(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiOkResponse({ description: 'The post', type: PostEntity })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async findPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'string', description: 'Post id' })
  @ApiBody({ type: UpdatePostDto  })
  @ApiOkResponse({ description: 'The updated post', type: PostEntity })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Post not found' })
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
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.delete(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by user id' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User id' })
  @ApiOkResponse({ description: 'List of posts for the user', type: [PostEntity] })
  async findAllPostsByUserId(
    @Param('userId') userId: string
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId);
  }
}
