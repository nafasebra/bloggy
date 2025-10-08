import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My first post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Full content of the post',
    example: 'This is the body of my post...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Short excerpt or summary of the post',
    example: 'A short summary of the post.',
  })
  @IsNotEmpty()
  @IsString()
  excerpt: string;

  @ApiProperty({
    description: 'Category of the post',
    example: 'Programming',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Tags associated with the post',
    example: ['nestjs', 'typescript'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'MongoDB ObjectId of the author',
    example: '5f8f8c44b54764421b7156c2',
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;

  @ApiProperty({
    description: 'Name of the author',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2025-09-12T12:34:56.789Z',
  })
  @IsNotEmpty()
  @IsString()
  createdAt: string;
}

