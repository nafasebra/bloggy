# TypeScript Decorators

## Description
TypeScript decorators are a way to add metadata and modify the behavior of classes, methods, properties, and parameters. They are extensively used in NestJS for dependency injection, validation, and API documentation.

## Syntax
```typescript
// Class decorator
@DecoratorName(options)
export class ClassName {
  // Class implementation
}

// Method decorator
@DecoratorName()
methodName() {
  // Method implementation
}

// Property decorator
@DecoratorName()
propertyName: string;

// Parameter decorator
methodName(@DecoratorName() parameter: string) {
  // Method implementation
}
```

## Parameters

| Decorator | Description | Example |
|-----------|-------------|---------|
| `@Injectable()` | Marks class as injectable service | `@Injectable()` |
| `@Controller()` | Marks class as HTTP controller | `@Controller('users')` |
| `@Module()` | Defines NestJS module | `@Module({ imports: [] })` |
| `@Get()`, `@Post()`, etc. | HTTP method decorators | `@Get(':id')` |
| `@Body()`, `@Param()`, `@Query()` | Request parameter decorators | `@Body() dto: CreateDto` |
| `@UseGuards()` | Applies guards to route | `@UseGuards(JwtAuthGuard)` |
| `@UseInterceptors()` | Applies interceptors | `@UseInterceptors(LoggingInterceptor)` |
| `@UsePipes()` | Applies pipes | `@UsePipes(ValidationPipe)` |
| `@IsString()`, `@IsEmail()`, etc. | Validation decorators | `@IsString()` |
| `@ApiProperty()` | Swagger documentation | `@ApiProperty({ description: 'Field' })` |

## Examples

### Example 1: Class Decorators
```typescript
import { Injectable, Controller, Module } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Injectable service
@Injectable()
export class UsersService {
  findAll() {
    return ['user1', 'user2'];
  }
}

// Controller
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

// Module
@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Example 2: Method Decorators
```typescript
import { Get, Post, Put, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Example 3: Parameter Decorators
```typescript
import { Body, Param, Query, Headers, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ) {
    return this.usersService.findAll({ page, limit, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') auth?: string
  ) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
```

### Example 4: Validation Decorators
```typescript
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    description: 'User age',
    example: 25,
    minimum: 13,
    maximum: 120
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    description: 'User is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'User bio',
    example: 'Software developer from New York',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
```

### Example 5: Custom Decorators
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract current user
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Custom decorator to extract JWT payload
export const JwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// Custom decorator to extract specific header
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);

// Usage in controller
@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get('info')
  getInfo(@UserAgent() userAgent: string) {
    return { userAgent };
  }
}
```

### Example 6: Guard and Interceptor Decorators
```typescript
import { UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('users')
export class UsersController {
  // Apply guard to specific method
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData() {
    return { message: 'This is protected data' };
  }

  // Apply interceptor to specific method
  @Post('log')
  @UseInterceptors(LoggingInterceptor)
  createWithLogging(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  // Apply pipe to specific method
  @Post('validate')
  @UsePipes(ValidationPipe)
  createWithValidation(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  // Apply multiple decorators
  @Post('secure')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @UsePipes(ValidationPipe)
  createSecure(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }
}
```

## Notes

- **Metadata Reflection**: Decorators use TypeScript's reflection metadata API
- **Execution Order**: Decorators are executed from bottom to top
- **Factory Functions**: Many decorators are factory functions that return decorators
- **Parameter Decorators**: Can only be used on method parameters
- **Property Decorators**: Can only be used on class properties
- **Method Decorators**: Can only be used on class methods
- **Class Decorators**: Can only be used on class declarations
- **Validation**: Use class-validator decorators for automatic validation
- **Documentation**: Use Swagger decorators for API documentation
- **Dependency Injection**: Use NestJS decorators for DI container integration

## Related Links
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [NestJS Decorators](https://docs.nestjs.com/custom-decorators)
- [class-validator Decorators](https://github.com/typestack/class-validator)
- [Swagger Decorators](https://docs.nestjs.com/openapi/types-and-parameters) 