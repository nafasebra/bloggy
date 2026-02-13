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

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authToken =
        (client.handshake.auth?.token as string | undefined) ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!authToken || typeof authToken !== 'string') {
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

      // Join user-specific room
      const joinResult = client.join(`user:${userId}`);
      if (
        joinResult &&
        typeof joinResult === 'object' &&
        'catch' in joinResult
      ) {
        void joinResult.catch((err: unknown) => {
          this.logger.error(`Failed to join room for user ${userId}:`, err);
        });
      }
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

  // Emit notification to specific user
  emitNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('new-notification', notification);
    this.logger.log(`Notification sent to user ${userId}`);
  }

  // Emit unread count update to specific user
  emitUnreadCount(userId: string, count: number) {
    this.server.to(`user:${userId}`).emit('unread-count', count);
  }

  // Handle mark as read event from client
  @SubscribeMessage('mark-as-read')
  handleMarkAsRead() {
    // This will be handled by the controller, but we can acknowledge it here
    return { success: true };
  }
}
