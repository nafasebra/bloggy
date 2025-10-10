import { Controller, UseGuards, Res } from '@nestjs/common';
import { Post, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto, LoginDto, AuthResponseDto, RefreshDto } from './dto';
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
import { ErrorResponseDto } from '../users/dto/error-response.dto';
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
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);

    // Set http-only cookie with refresh_token
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
    return {
      status: 'success',
      message: 'User logged in successfully',
      user: result.user,
      access_token: result.access_token,
    };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Refreshes the access token using a valid refresh token.',
    tags: ['Authentication'],
  })
  @ApiBody({
    type: RefreshDto,
    description: 'Refresh token data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    type: ErrorResponseDto,
  })
  async refresh(@Body() refreshDto: RefreshDto) {
    const result = await this.authService.refresh(refreshDto.refresh_token);
    return {
      status: 'success',
      message: 'Tokens refreshed successfully',
      ...result,
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
    // Clear the http-only refresh_token cookie
    res.clearCookie('refresh_token', { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict' 
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
