import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import {
  CreateCommentDtoType,
  ReplyCommentDtoType,
  LikeCommentDtoType,
} from './dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentModel: Model<Comment>) {}

  async create(comment: CreateCommentDtoType): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    return newComment.save();
  }

  async reply(comment: ReplyCommentDtoType): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    return newComment.save();
  }

  async like(comment: LikeCommentDtoType): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    return newComment.save();
  }
}
