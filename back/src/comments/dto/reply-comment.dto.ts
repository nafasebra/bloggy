import { OmitType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Comment } from '../schemas/comment.schema';

export class ReplyCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  parentId: string;

  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @IsNotEmpty()
  @IsMongoId()
  authorId: string;
}

export class ReplyCommentDtoType extends OmitType(Comment, [
  'likes',
  'createdAt',
  'updatedAt',
] as const) {}
