import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  relatedUserId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Post' })
  relatedPostId?: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  relatedCommentId?: ObjectId;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true })
  message: string;

  @Prop()
  link?: string;

  @Prop({ default: Date.now, immutable: true })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create indexes for efficient queries
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
