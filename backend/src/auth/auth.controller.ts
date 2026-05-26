import {
  Controller,
  Res,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  ForgetPasswordDto,
} from './dto';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from './cookie.config';

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

    res.cookie(
      SESSION_COOKIE_NAME,
      result.session_token,
      getSessionCookieOptions()
    );

    return {
      status: 'success',
      message: 'User logged in successfully',
      user: result.user,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logs out a user by clearing the session cookie.',
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
    res.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());

    return {
      status: 'success',
      message: 'User logged out successfully',
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change user password',
    description: 'Allows the authenticated user to change their password.',
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
    description: 'Invalid old password or not authenticated',
    type: ErrorResponseDto,
  })
  async changePassword(
    @Request() req: { user: { userId: string } },
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    await this.authService.changePassword(req.user.userId, changePasswordDto);
    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  @Post('forget-password')
  @ApiOperation({
    summary: 'Request a password reset',
    description:
      'Sends a password reset link to the provided email if the account exists.',
    tags: ['Authentication'],
  })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If the email exists, a reset link will be sent',
  })
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.authService.forgetPassword(forgetPasswordDto);
    return {
      status: 'success',
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }
}
