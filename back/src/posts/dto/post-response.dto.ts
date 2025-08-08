import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../schemas/post.schema';

export class PostResponseDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post',
  })
  content: string;

  @ApiProperty({
    description: 'The excerpt of the post',
    example: 'This is the summary of my first post',
  })
  excerpt: string;

  @ApiProperty({
    description: 'The tags of the post',
    example: ['tag1', 'tag2'],
  })
  tags: string[];

  @ApiProperty({
    description: 'The category of the post',
    example: 'Technology',
  })
  category: string;

  @ApiProperty({
    description: 'The author ID of the post',
    example: '60d0fe4f5311236168a109ca',
  })
  authorId: string;

  @ApiProperty({
    description: 'The views of the post (default: 0 - optional)',
    example: 100,
  })
  views?: number;

  @ApiProperty({
    description: 'The likes of the post (default: 0 - optional)',
    example: 100,
  })
  likes?: number;

  @ApiProperty({
    description: 'The comments of the post (default: [] - optional)',
    example: ['60d0fe4f5311236168a109ca', '60d0fe4f5311236168a109cb'],
  })
  commentIds?: string[];

  @ApiProperty({
    description: 'The createdAt of the post (optional)',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'The updatedAt of the post (optional)',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;
}

