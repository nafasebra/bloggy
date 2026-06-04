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
import { ForgetPasswordDto } from './dto/forget-password.dto';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: number }).code === 11000
      ) {
        throw new ConflictException('Username or email is already taken');
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
      role: user.role ?? 'user',
    };

    const session_token = this.jwtService.sign(payload, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      session_token,
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

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
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
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
    });

    if (!user) {
      // Return silently to avoid email enumeration
      return;
    }

    const resetToken = this.jwtService.sign(
      { sub: user._id, purpose: 'password-reset' },
      { expiresIn: '1h' }
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[dev] Password reset token for ${forgetPasswordDto.email}: ${resetToken}`
      );
    }
  }
}
