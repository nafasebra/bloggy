import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto, UserResponseDto, SingleUserResponseDto, UsersResponseDto, ErrorResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
    type: UsersResponseDto,
  })
  findAll() {
    return this.usersService.findAll();
  }

  // get current user info from access token
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information from access token' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: SingleUserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getCurrentUser(@Request() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: SingleUserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: SingleUserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: SingleUserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
