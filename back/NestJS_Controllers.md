# NestJS Controllers

## Description
Controllers handle incoming HTTP requests and return responses to the client. They define the routing structure and request handling logic in NestJS applications.

## Syntax
```typescript
@Controller('route-prefix')
export class ControllerName {
  constructor(private readonly service: ServiceName) {}
  
  @HttpMethod('route')
  methodName(@Param() param: string, @Body() body: DTO) {
    return this.service.method();
  }
}
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `@Controller()` | Defines the controller and route prefix | `@Controller('users')` |
| `@Get()` | Handles GET requests | `@Get(':id')` |
| `@Post()` | Handles POST requests | `@Post('register')` |
| `@Put()` | Handles PUT requests | `@Put(':id')` |
| `@Delete()` | Handles DELETE requests | `@Delete(':id')` |
| `@Patch()` | Handles PATCH requests | `@Patch(':id')` |
| `@Body()` | Extracts request body | `@Body() createDto: CreateDto` |
| `@Param()` | Extracts route parameters | `@Param('id') id: string` |
| `@Query()` | Extracts query parameters | `@Query('page') page: number` |
| `@Headers()` | Extracts request headers | `@Headers('authorization') auth: string` |

## Examples

### Example 1: Basic Controller with CRUD Operations
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Example 2: Controller with Swagger Documentation
```typescript
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

### Example 3: Controller with Custom Status Codes
```typescript
@Controller('posts')
export class PostsController {
  @Post()
  @HttpCode(201)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query('page') page: number = 1) {
    return this.postsService.findAll(page);
  }
}
```

## Notes

- **Dependency Injection**: Controllers receive services through constructor injection
- **Request Validation**: Use DTOs with class-validator decorators for automatic validation
- **Response Transformation**: Use class-transformer for response serialization
- **Error Handling**: NestJS provides built-in exception filters and interceptors
- **Guards**: Use guards for authentication and authorization
- **Interceptors**: Use interceptors for logging, caching, and response transformation
- **Pipes**: Use pipes for parameter transformation and validation

## Related Links
- [NestJS Controllers Documentation](https://docs.nestjs.com/controllers)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Express.js Request/Response](https://expressjs.com/en/api.html) 