import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post-response.dto';

export class ViewPostResponseDto {
  @ApiProperty({ type: PostResponseDto })
  post: PostResponseDto;

  @ApiProperty({ description: 'Whether this is a new view from this IP address' })
  isNewView: boolean;

  @ApiProperty({ description: 'Message about the view status' })
  message: string;
}

export class PostViewStatsDto {
  @ApiProperty({ description: 'Total number of views (including repeat views)' })
  totalViews: number;

  @ApiProperty({ description: 'Number of unique IP addresses that viewed this post' })
  uniqueViews: number;
}
