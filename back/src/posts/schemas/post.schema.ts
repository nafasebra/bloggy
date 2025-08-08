import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaType, SchemaTypes } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  excerpt: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  authorId: ObjectId;

  @Prop()
  views?: number;

  @Prop()
  likes?: number;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Comment' })
  commentIds?: ObjectId[];

  @Prop({ default: Date.now, immutable: true })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
