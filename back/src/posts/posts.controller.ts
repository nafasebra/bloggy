import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async cratePost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto as PostEntity);
  }

  @Get()
  async findAllPosts(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findById(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto as PostEntity);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.delete(id);
  }

  @Get('user/:userId')
  async findAllPostsByUserId(
    @Param('userId') userId: string
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId);
  }
}
