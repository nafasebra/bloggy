import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { getCorsOrigins } from '../common/config/cors.config';
import { SESSION_COOKIE_NAME } from '../auth/cookie.config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

function extractTokenFromHandshake(client: Socket): string | null {
  const authToken = client.handshake.auth?.token as string | undefined;
  if (authToken && typeof authToken === 'string') {
    return authToken;
  }

  const authHeader = client.handshake.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookieHeader = client.handshake.headers?.cookie;
  if (typeof cookieHeader === 'string') {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      const [name, ...valueParts] = cookie.split('=');
      if (name === SESSION_COOKIE_NAME) {
        return valueParts.join('=');
      }
    }
  }

  return null;
}

@WebSocketGateway({
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authToken = extractTokenFromHandshake(client);

      if (!authToken) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email?: string;
        username?: string;
      }>(authToken, {
        secret: process.env.JWT_SECRET || '',
      });

      const userId = payload.sub;
      if (!userId || typeof userId !== 'string') {
        this.logger.warn(`Invalid payload for client ${client.id}`);
        client.disconnect();
        return;
      }

      client.userId = userId;
      this.connectedUsers.set(userId, client.id);

      this.logger.log(`User ${userId} connected with socket ${client.id}`);

      void client.join(`user:${userId}`);
    } catch (error: unknown) {
      this.logger.error(
        `Authentication failed for client ${client.id}:`,
        error
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('new-notification', notification);
    this.logger.log(`Notification sent to user ${userId}`);
  }

  emitUnreadCount(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('unread-count', count);
  }

  @SubscribeMessage('mark-as-read')
  handleMarkAsRead() {
    return { success: true };
  }
}
