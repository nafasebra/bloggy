import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
