import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The unique username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'A short biography of the user',
    example: 'Software developer passionate about web technologies',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: "URL to the user's avatar image",
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @ApiPropertyOptional({
    description: "The user's location",
    example: 'San Francisco, CA',
  })
  location?: string;

  @ApiPropertyOptional({
    description: "The user's personal website",
    example: 'https://johndoe.com',
  })
  website?: string;

  @ApiPropertyOptional({
    description: "The user's Twitter handle",
    example: '@johndoe',
  })
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Number of followers',
    example: 150,
  })
  followers?: number;

  @ApiPropertyOptional({
    description: 'Number of users being followed',
    example: 75,
  })
  following?: number;

  @ApiPropertyOptional({
    description: "The user's category or role",
    example: 'developer',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Array of post IDs created by the user',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
  })
  postIds?: Types.ObjectId[];

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: Date;
}
