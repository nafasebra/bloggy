import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class LikePostResponseDto {
  @ApiProperty({ type: PostResponseDto })
  post: PostResponseDto;

  @ApiProperty({ description: 'Whether this is a new like from this IP address' })
  isNewLike: boolean;

  @ApiProperty({ description: 'Message about the like status' })
  message: string;
}


