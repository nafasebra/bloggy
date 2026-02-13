import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override canActivate to make authentication optional
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Always return true - authentication is optional
    // The guard will still try to validate the token if present
    return super.canActivate(context) as Promise<boolean>;
  }

  // Override handleRequest to not throw error if no user
  handleRequest<TUser = any>(
    err: any,
    user: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _status?: any
  ): TUser {
    // Return user if exists, otherwise return null (don't throw error)
    // Using type assertion to satisfy base class signature while allowing null
    if (err || !user) {
      return null as TUser;
    }
    return user as TUser;
  }
}
