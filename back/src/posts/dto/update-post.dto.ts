import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Post } from '../schemas/post.schema';
import { OmitType } from '@nestjs/mapped-types';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  excerpt: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsMongoId()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  updatedAt: string;
}

export class UpdatePostDtoType extends OmitType(Post, [
  'views',
  'likes',
  'commentIds',
  'createdAt',
] as const) {}
