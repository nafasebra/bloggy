import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type CommentLikeDocument = CommentLike & Document;

@Schema({ timestamps: true })
export class CommentLike {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Comment' })
  commentId: ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: Date.now, immutable: true })
  likesAt: Date;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);

// Create compound index to prevent duplicate likes from same IP for same comment
CommentLikeSchema.index({ commentId: 1, ipAddress: 1 }, { unique: true });
