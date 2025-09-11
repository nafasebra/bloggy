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
import { CreatePostDtoType, UpdatePostDtoType } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async cratePost(
    @Body() createPostDto: CreatePostDtoType
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
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
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDtoType
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
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
