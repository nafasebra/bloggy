import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class ReplyCommentDto {
  @ApiProperty({
    description: 'Reply text content',
    example: 'Thanks for the clarification!',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID of the comment being replied to',
    example: '60d5ec49f1a4c12a4c8b4567',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  parentId: string;

  @ApiProperty({
    description: 'ID of the post that contains the comment thread',
    example: '60d5ec49f1a4c12a4c8b1234',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @ApiProperty({
    description: 'Author (user) ID of the reply',
    example: '60d5ec49f1a4c12a4c8b9876',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;
}

