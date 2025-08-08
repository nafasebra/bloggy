# NestJS Modules

## Description
NestJS modules are the fundamental building blocks of NestJS applications. They organize related functionality into cohesive units and manage dependency injection. Each module encapsulates a specific feature or domain of your application.

## Syntax
```typescript
import { Module } from '@nestjs/common';

@Module({
  imports: [OtherModule],
  controllers: [ControllerName],
  providers: [ServiceName],
  exports: [ServiceName],
})
export class ModuleName {}
```

## Parameters

| Property | Description | Example |
|----------|-------------|---------|
| `imports` | Other modules to import | `imports: [DatabaseModule, AuthModule]` |
| `controllers` | Controllers in this module | `controllers: [UsersController]` |
| `providers` | Services and other providers | `providers: [UsersService, EmailService]` |
| `exports` | Providers to expose to other modules | `exports: [UsersService]` |

## Examples

### Example 1: Basic Module Structure
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Example 2: Feature Module with Dependencies
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Example 3: Database Module
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### Example 4: Configuration Module
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
  ],
})
export class ConfigurationModule {}
```

### Example 5: Posts Module with Comments
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema }
    ])
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService],
  exports: [PostsService],
})
export class PostsModule {}
```

### Example 6: Root Application Module
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Example 7: Shared Module
```typescript
import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { FileService } from './file.service';
import { NotificationService } from './notification.service';

@Global()
@Module({
  providers: [EmailService, FileService, NotificationService],
  exports: [EmailService, FileService, NotificationService],
})
export class SharedModule {}
```

### Example 8: Dynamic Module
```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

export interface CacheConfig {
  ttl: number;
  max: number;
}

@Module({})
export class CacheConfigModule {
  static forRoot(config: CacheConfig): DynamicModule {
    return {
      module: CacheConfigModule,
      imports: [
        CacheModule.register({
          ttl: config.ttl,
          max: config.max,
        }),
      ],
      exports: [CacheModule],
    };
  }
}

// Usage in AppModule
@Module({
  imports: [
    CacheConfigModule.forRoot({
      ttl: 60000, // 1 minute
      max: 100,   // maximum 100 items
    }),
  ],
})
export class AppModule {}
```

## Notes

- **Single Responsibility**: Each module should have a single, well-defined responsibility
- **Dependency Injection**: Modules manage the DI container for their providers
- **Encapsulation**: Modules encapsulate related functionality and hide implementation details
- **Reusability**: Export providers that other modules might need
- **Global Modules**: Use `@Global()` for modules that should be available everywhere
- **Dynamic Modules**: Use `DynamicModule` for configurable modules
- **Circular Dependencies**: Avoid circular dependencies between modules
- **Feature Modules**: Organize modules by feature rather than by type
- **Shared Modules**: Create shared modules for common functionality
- **Lazy Loading**: Consider lazy loading for large modules

## Related Links
- [NestJS Modules Documentation](https://docs.nestjs.com/modules)
- [NestJS Dynamic Modules](https://docs.nestjs.com/fundamentals/dynamic-modules)
- [NestJS Circular Dependencies](https://docs.nestjs.com/fundamentals/circular-dependency)
- [NestJS Module Reference](https://docs.nestjs.com/fundamentals/module-reference) 