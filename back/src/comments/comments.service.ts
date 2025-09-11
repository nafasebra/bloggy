import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import {
  CreateCommentDtoType,
  ReplyCommentDtoType,
  LikeCommentDtoType,
} from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>
  ) {}

  async findByPostId(id: string): Promise<Comment[]> {
    const comments = await this.commentModel.find({ post_id: id }).exec();
    if (!comments || comments.length === 0) {
      throw new NotFoundException(`Comments not found for post id: ${id}`);
    }
    return comments;
  }

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
