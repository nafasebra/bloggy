import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type PostLikeDocument = PostLike & Document;

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Post' })
  postId: ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: Date.now, immutable: true })
  likesAt: Date;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

// Create compound index to prevent duplicate likes from same IP for same post
PostLikeSchema.index({ postId: 1, ipAddress: 1 }, { unique: true });
