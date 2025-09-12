import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeCommentDto {
  @ApiProperty({ description: 'MongoDB ObjectId of the comment', example: '60d5ec49f1b2c43f88e9c9d1' })
  @IsNotEmpty()
  @IsMongoId()
  commentId: string;

  @ApiProperty({ description: 'MongoDB ObjectId of the user who liked the comment', example: '60d5ec49f1b2c43f88e9c9d2' })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}

