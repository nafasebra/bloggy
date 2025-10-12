import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Post not found',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Not Found',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-20T14:45:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/posts/507f1f77bcf86cd799439011',
  })
  path: string;
}
