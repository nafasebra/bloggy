import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    content: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Post' })
    postId: ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    authorId: ObjectId;

    @Prop()
    likes?: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
    parentId?: ObjectId;

    @Prop({ default: Date.now, immutable: true })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
