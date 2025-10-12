import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class LikePostResponseDto {
  @ApiProperty({ type: PostResponseDto })
  post: PostResponseDto;

  @ApiProperty({ description: 'Whether the post is currently liked by this IP address' })
  isLiked: boolean;

  @ApiProperty({ description: 'Message about the like status' })
  message: string;
}


