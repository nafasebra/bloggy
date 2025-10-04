import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import {
  CreateCommentDto,
  ReplyCommentDto,
  LikeCommentDto,
} from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>
  ) {}

  async findByPostId(id: string): Promise<Comment[]> {
    const comments = await this.commentModel.find({ postId: id }).populate('authorId').exec();
    if (!comments || comments.length === 0) {
      return [];
    }
    return comments;
  }

  async create(postId: string, comment: CreateCommentDto): Promise<Comment> {
    const newComment = new this.commentModel({ ...comment, postId });
    return newComment.save();
  }

  async reply(postId: string, comment: ReplyCommentDto): Promise<Comment> {
    const newComment = new this.commentModel({ ...comment, postId });
    return newComment.save();
  }

  async like(postId: string, comment: LikeCommentDto): Promise<Comment> {
    const newComment = new this.commentModel({ ...comment, postId });
    return newComment.save();
  }
}
