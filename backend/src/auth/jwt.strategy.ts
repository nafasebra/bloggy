// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

function cookieExtractor(req: Request): string | null {
  const token = req.cookies?.session_token;
  return typeof token === 'string' ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    username: string;
    role?: string;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role ?? 'user',
    };
  }
}
