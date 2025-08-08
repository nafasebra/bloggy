import { OmitType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Comment } from '../schemas/comment.schema';

export class LikeCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  commentId: string;
}

export class LikeCommentDtoType extends OmitType(Comment, [
  'likes',
  'createdAt',
  'updatedAt',
  'parentId',
  'postId',
  'authorId',
] as const) {}
