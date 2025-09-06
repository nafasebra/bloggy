# NestJS DTOs (Data Transfer Objects)

## Description
DTOs define the structure and validation rules for incoming request data and outgoing response data in NestJS applications. They ensure type safety and data validation.

## Syntax
```typescript
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;
}
```

## Parameters

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@IsString()` | Validates string type | `@IsString()` |
| `@IsEmail()` | Validates email format | `@IsEmail()` |
| `@IsNumber()` | Validates number type | `@IsNumber()` |
| `@IsBoolean()` | Validates boolean type | `@IsBoolean()` |
| `@IsOptional()` | Makes field optional | `@IsOptional()` |
| `@IsNotEmpty()` | Ensures field is not empty | `@IsNotEmpty()` |
| `@MinLength()` | Minimum string length | `@MinLength(3)` |
| `@MaxLength()` | Maximum string length | `@MaxLength(50)` |
| `@Min()` | Minimum number value | `@Min(0)` |
| `@Max()` | Maximum number value | `@Max(100)` |
| `@ApiProperty()` | Swagger documentation | `@ApiProperty({ description: 'Field description' })` |

## Examples

### Example 1: User Registration DTO
```typescript
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
    minLength: 3,
    maxLength: 30
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User bio (optional)',
    example: 'Software developer from New York',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
```

### Example 2: Login DTO
```typescript
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email',
    example: 'johndoe'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Example 3: Update User DTO (Partial)
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'User location',
    example: 'New York, NY',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'User website',
    example: 'https://johndoe.com',
    required: false
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}
```

### Example 4: Response DTO
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011'
  })
  _id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe'
  })
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer from New York',
    required: false
  })
  bio?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false
  })
  avatar?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: Date;
}
```

## Notes

- **Validation Pipes**: Enable global validation by adding `ValidationPipe` to your app
- **Transform Options**: Use `transform: true` to automatically transform payloads
- **Whitelist**: Use `whitelist: true` to strip non-whitelisted properties
- **Forbid Non-whitelisted**: Use `forbidNonWhitelisted: true` to throw errors for non-whitelisted properties
- **Partial Types**: Use `PartialType()` from `@nestjs/mapped-types` for update DTOs
- **Pick Types**: Use `PickType()` to select specific properties from existing DTOs
- **Omit Types**: Use `OmitType()` to exclude specific properties from existing DTOs
- **Intersection Types**: Use `IntersectionType()` to combine multiple DTOs

## Related Links
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [Swagger Property Decorators](https://docs.nestjs.com/openapi/types-and-parameters) 