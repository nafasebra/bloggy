import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  IsMongoId,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The unique username of the user',
    example: 'johndoe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'A short biography of the user',
    example: 'Software developer passionate about web technologies',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: "URL to the user's avatar image",
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: "The user's location",
    example: 'San Francisco, CA',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "The user's personal website",
    example: 'https://johndoe.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    description: "The user's Twitter handle",
    example: '@johndoe',
  })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({
    description: 'Number of followers',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  followers?: number;

  @ApiPropertyOptional({
    description: 'Number of users being followed',
    example: 75,
  })
  @IsOptional()
  @IsNumber()
  following?: number;

  @ApiProperty({
    description: "The user's category or role",
    example: 'developer',
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    description: 'Indicates if the user is new',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({
    description: "The user's role (admin or user)",
    example: 'user',
    enum: ['admin', 'user'],
  })
  @IsOptional()
  @IsString()
  role?: 'admin' | 'user';

  @ApiPropertyOptional({
    description: 'Array of post IDs created by the user',
    example: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  postIds?: string[];

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2024-01-20T14:45:00.000Z',
  })
  @IsDate()
  updatedAt: Date;
}

export class UsersResponseDto {
  @ApiProperty({
    description: 'Success status of the request',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Users retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of users',
    type: [UserResponseDto],
  })
  @IsArray()
  data: UserResponseDto[];

  @ApiProperty({
    description: 'Total number of users',
    example: 100,
  })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({
    description: 'Pagination information',
    example: { page: 1, limit: 10, totalPages: 10 },
  })
  @IsOptional()
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class SingleUserResponseDto {
  @ApiProperty({
    description: 'Success status of the request',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'User retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User data',
    type: UserResponseDto,
  })
  data: UserResponseDto;
}
