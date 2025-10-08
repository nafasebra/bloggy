import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class PostResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The excerpt of the post',
    example: 'This is the summary of my first post',
  })
  @IsString()
  excerpt: string;

  @ApiProperty({
    description: 'The tags of the post',
    example: ['technology', 'programming', 'javascript'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'The category of the post',
    example: 'Technology',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The author ID of the post',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsMongoId()
  authorId: string;

  @ApiProperty({
    description: 'Name of the author',
    example: 'John Doe',
  })
  @IsString()
  authorName: string;

  @ApiPropertyOptional({
    description: 'The number of views of the post',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  views?: number;

  @ApiPropertyOptional({
    description: 'The number of likes of the post',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  likes?: number;

  @ApiPropertyOptional({
    description: 'The comment IDs of the post',
    example: ['60d0fe4f5311236168a109ca', '60d0fe4f5311236168a109cb'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  commentIds?: string[];

  @ApiProperty({
    description: 'The date when the post was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the post was last updated',
    example: '2024-01-20T14:45:00.000Z',
  })
  @IsDate()
  updatedAt: Date;
}

export class PostsResponseDto {
  @ApiProperty({
    description: 'Success status of the request',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Posts retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of posts',
    type: [PostResponseDto],
  })
  @IsArray()
  data: PostResponseDto[];

  @ApiProperty({
    description: 'Total number of posts',
    example: 50,
  })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({
    description: 'Pagination information',
    example: { page: 1, limit: 10, totalPages: 5 },
  })
  @IsOptional()
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class SinglePostResponseDto {
  @ApiProperty({
    description: 'Success status of the request',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Post created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Post data',
    type: PostResponseDto,
  })
  data: PostResponseDto;
}
