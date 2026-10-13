import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeCommentDto {
  @ApiProperty({
    description: 'UUID of the comment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  commentId: string;

  @ApiProperty({
    description: 'UUID of the user who liked the comment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
