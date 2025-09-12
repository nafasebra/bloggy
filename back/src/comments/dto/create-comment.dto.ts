import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment', example: 'This is a great post!' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'The ID of the post being commented on', example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @ApiProperty({ description: 'The ID of the author of the comment', example: '507f1f77bcf86cd799439012' })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;
}

