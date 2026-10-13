import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard, AdminGuard, PassportModule],
})
export class AuthModule {}
