import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type PostViewDocument = PostView & Document;

@Schema({ timestamps: true })
export class PostView {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Post' })
  postId: ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: Date.now, immutable: true })
  viewedAt: Date;
}

export const PostViewSchema = SchemaFactory.createForClass(PostView);

// Create compound index to prevent duplicate views from same IP for same post
PostViewSchema.index({ postId: 1, ipAddress: 1 }, { unique: true });
