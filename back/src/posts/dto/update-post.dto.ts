import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Post } from '../schemas/post.schema';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: 'Title of the post', example: 'My First Blog Post' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Content of the post', example: 'This is the content of the blog post.' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Excerpt of the post', example: 'A short summary of the blog post.' })
  @IsNotEmpty()
  @IsString()
  excerpt: string;

  @ApiProperty({ description: 'Category of the post', example: 'Technology' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Tags associated with the post', type: [String], example: ['nestjs', 'typescript', 'blog'] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'ID of the author', type: String, example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;

  @ApiProperty({ description: 'Last updated timestamp', type: String, example: '2023-10-01T12:00:00Z' })
  @IsNotEmpty()
  @IsString()
  updatedAt: string;
}

