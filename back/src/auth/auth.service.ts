import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const hashed_password = await bcrypt.hash(registerDto.password, 10);
    const user = {
      username: registerDto.username,
      email: registerDto.email,
      password: hashed_password,
    };
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async login(loginDto: LoginDto) {
    const hashed_password = await bcrypt.hash(loginDto.password, 10);
    const user = {
      username: loginDto.username,
      passowrd: hashed_password,
    };
    const finded_user = this.userModel.findOne({ ...user });
    if (!finded_user) {
      throw new NotFoundException();
    }

    // sign it with jwt service
    // and then, return access_token and refresh_token
  }
}
