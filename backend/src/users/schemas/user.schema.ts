import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop()
  location?: string;

  @Prop()
  website?: string;

  @Prop()
  twitter?: string;

  @Prop()
  followers?: number;

  @Prop()
  following?: number;

  @Prop()
  category: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Post' })
  postIds?: ObjectId[];

  @Prop({ default: true })
  isNew: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
