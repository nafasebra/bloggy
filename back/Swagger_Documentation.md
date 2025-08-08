# Swagger Documentation

## Description
Swagger/OpenAPI documentation automatically generates interactive API documentation from your NestJS controllers and DTOs. It provides a user-friendly interface for testing and understanding your API endpoints.

## Syntax
```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Resource Name')
@Controller('resource')
export class ResourceController {
  @ApiOperation({ summary: 'Operation description' })
  @ApiResponse({ status: 200, description: 'Success response' })
  @Post()
  create(@ApiBody({ type: CreateDto }) @Body() createDto: CreateDto) {
    return this.service.create(createDto);
  }
}
```

## Parameters

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@ApiTags()` | Groups endpoints by tag | `@ApiTags('Users')` |
| `@ApiOperation()` | Describes the operation | `@ApiOperation({ summary: 'Create user' })` |
| `@ApiResponse()` | Documents response | `@ApiResponse({ status: 201, type: UserDto })` |
| `@ApiBody()` | Documents request body | `@ApiBody({ type: CreateUserDto })` |
| `@ApiParam()` | Documents path parameters | `@ApiParam({ name: 'id', type: 'string' })` |
| `@ApiQuery()` | Documents query parameters | `@ApiQuery({ name: 'page', required: false })` |
| `@ApiHeader()` | Documents headers | `@ApiHeader({ name: 'Authorization' })` |
| `@ApiBearerAuth()` | Indicates Bearer token auth | `@ApiBearerAuth()` |
| `@ApiProperty()` | Documents DTO properties | `@ApiProperty({ description: 'User name' })` |
| `@ApiPropertyOptional()` | Documents optional properties | `@ApiPropertyOptional()` |

## Examples

### Example 1: Basic Controller Documentation
```typescript
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users with optional pagination'
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto]
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error'
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Creates a new user account with the provided information'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User creation data'
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user with new information'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User update data'
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Removes a user from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'User unique identifier'
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Example 2: DTO Documentation
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
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
    description: 'Unique username for the user',
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
    example: 'john@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'User bio or description',
    example: 'Software developer from New York',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    format: 'uri'
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'User bio or description',
    example: 'Software developer from New York'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'User location',
    example: 'New York, NY'
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'User website URL',
    example: 'https://johndoe.com',
    format: 'uri'
  })
  @IsOptional()
  @IsString()
  website?: string;
}
```

### Example 3: Response DTO Documentation
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '507f1f77bcf86cd799439011'
  })
  _id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe'
  })
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User bio or description',
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
    description: 'User location',
    example: 'New York, NY',
    required: false
  })
  location?: string;

  @ApiProperty({
    description: 'User website URL',
    example: 'https://johndoe.com',
    required: false
  })
  website?: string;

  @ApiProperty({
    description: 'Number of followers',
    example: 150,
    default: 0
  })
  followers: number;

  @ApiProperty({
    description: 'Number of users being followed',
    example: 75,
    default: 0
  })
  following: number;

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

### Example 4: Swagger Configuration
```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Bloggy API')
    .setDescription('A comprehensive blogging platform API')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Posts', 'Blog post management endpoints')
    .addTag('Comments', 'Comment management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Bloggy API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(3000);
}
bootstrap();
```

## Notes

- **API Versioning**: Use version tags to document different API versions
- **Security Schemes**: Document authentication methods (Bearer, Basic, API Key)
- **Response Examples**: Provide realistic examples for better understanding
- **Error Responses**: Document all possible error scenarios
- **Request/Response Models**: Use DTOs to define clear data structures
- **Tags**: Group related endpoints using meaningful tags
- **Descriptions**: Provide clear, concise descriptions for all operations
- **Examples**: Include realistic examples for all properties and responses
- **Deprecation**: Mark deprecated endpoints with appropriate decorators
- **Testing**: Use Swagger UI to test your API endpoints during development

## Related Links
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Swagger Editor](https://swagger.io/tools/swagger-editor/) 