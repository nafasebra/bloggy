import { IsUUID, IsNotEmpty, IsString } from 'class-validator';
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
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  parentId: string;

  @ApiProperty({
    description: 'ID of the post that contains the comment thread',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: 'Author (user) ID of the reply',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @ApiProperty({
    description: 'Name of the author',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  authorName: string;
}
