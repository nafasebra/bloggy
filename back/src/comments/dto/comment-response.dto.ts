import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CommentResponseDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the post this comment belongs to',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  postId: string;

  @ApiProperty({
    description: 'The ID of the user who authored the comment',
    example: '507f1f77bcf86cd799439013',
  })
  @IsMongoId()
  authorId: string;

  @ApiProperty({
    description: 'The name of the user who authored the comment',
    example: 'John Doe',
  })
  @IsString()
  authorName: string;

  @ApiPropertyOptional({
    description: 'The number of likes for this comment',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  likes?: number;

  @ApiPropertyOptional({
    description: 'The ID of the parent comment (for replies)',
    example: '507f1f77bcf86cd799439014',
  })
  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @ApiProperty({
    description: 'The date when the comment was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the comment was last updated',
    example: '2024-01-20T14:45:00.000Z',
  })
  @IsDate()
  updatedAt: Date;
}

export class CommentsResponseDto {
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
    example: 'Comments retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of comments',
    type: [CommentResponseDto],
  })
  @IsArray()
  data: CommentResponseDto[];

  @ApiProperty({
    description: 'Total number of comments',
    example: 25,
  })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({
    description: 'Pagination information',
    example: { page: 1, limit: 10, totalPages: 3 },
  })
  @IsOptional()
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class SingleCommentResponseDto {
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
    example: 'Comment created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Comment data',
    type: CommentResponseDto,
  })
  data: CommentResponseDto;
}
