import { IsUUID, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the post being commented on',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: 'The ID of the author of the comment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @ApiProperty({ description: 'Name of the author', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  authorName: string;
}
