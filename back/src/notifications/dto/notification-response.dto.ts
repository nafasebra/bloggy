import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../schemas/notification.schema';

export class NotificationResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  relatedUserId: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };

  @ApiProperty({ required: false })
  relatedPostId?: {
    _id: string;
    title: string;
  };

  @ApiProperty({ required: false })
  relatedCommentId?: {
    _id: string;
    content: string;
  };

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  link?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class NotificationsResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  notifications: NotificationResponseDto[];
}

export class UnreadCountResponseDto {
  @ApiProperty()
  count: number;
}
