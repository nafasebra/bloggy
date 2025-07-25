import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  posts?: Post[];

  @Prop({ default: Date.now, immutable: true })
  createdAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
