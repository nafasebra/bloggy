import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  followerId: ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  followingId: ObjectId;

  @Prop({ default: Date.now, immutable: true })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Add a unique compound index to prevent duplicate follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
