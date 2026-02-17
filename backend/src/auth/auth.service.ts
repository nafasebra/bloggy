import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const hashed_password = await bcrypt.hash(registerDto.password, 10);
    const user = {
      name: registerDto.name,
      username: registerDto.username,
      email: registerDto.email,
      password: hashed_password,
    };
    const newUser = new this.userModel(user);
    try {
      return await newUser.save();
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Username or email is already taken'
        );
      }
      throw err;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      $or: [{ username: loginDto.username }, { email: loginDto.username }],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isNew: user.isNew,
        role: user.role ?? 'user',
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const newPayload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };
    const access_token = this.jwtService.sign(newPayload, { expiresIn: '1h' });
    return {
      access_token,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(changePasswordDto.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.new_password,
      10
    );
    await this.userModel.findByIdAndUpdate(changePasswordDto.userId, {
      password: hashedNewPassword,
    });
  }
}
