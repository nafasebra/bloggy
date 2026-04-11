import { Controller, Res } from '@nestjs/common';
import { Post, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { ChangePasswordDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with the provided information. The username and email must be unique.',
    tags: ['Authentication'],
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Username or email already exists',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto).then(user => ({
      status: 'success',
      message: 'User registered successfully',
      user,
    }));
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description:
      'Authenticates a user with username/email and password. Returns user information upon successful login.',
    tags: ['Authentication'],
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);

    // Set http-only cookie with session_token
    res.cookie('session_token', result.session_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      status: 'success',
      message: 'User logged in successfully',
      user: result.user,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logs out a user by clearing the refresh token cookie.',
    tags: ['Authentication'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged out successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'User logged out successfully' },
      },
    },
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the http-only session_token cookie
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      status: 'success',
      message: 'User logged out successfully',
    };
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Allows a user to change their password.',
    tags: ['Authentication'],
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Change password data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid old password',
    type: ErrorResponseDto,
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(changePasswordDto);
    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  // TODO forget password
}
