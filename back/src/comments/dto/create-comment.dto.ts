import { OmitType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Comment } from '../schemas/comment.schema';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @IsNotEmpty()
  @IsMongoId()
  authorId: string;
}

export class CreateCommentDtoType extends OmitType(Comment, [
  'likes',
  'createdAt',
  'updatedAt',
  'parentId',
] as const) {}
