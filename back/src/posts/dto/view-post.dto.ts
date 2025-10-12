import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class ViewPostResponseDto {
  @ApiProperty({ type: PostResponseDto })
  post: PostResponseDto;

  @ApiProperty({
    description: 'Whether this is a new view from this IP address',
  })
  isNewView: boolean;

  @ApiProperty({ description: 'Message about the view status' })
  message: string;
}
