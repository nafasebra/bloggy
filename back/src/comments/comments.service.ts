import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto, ReplyCommentDto } from './dto';
import { CommentLike } from './schemas/comment-like.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: Model<CommentLike>
  ) {}

  async findByPostId(id: string): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ postId: id })
      .populate('authorId')
      .exec();
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

  async like(commentId: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel.findById({ commentId });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.commentLikeModel
      .findOne({ commentId: comment._id, userId })
      .exec();

    if (existingLike) {
      await this.commentLikeModel
        .deleteOne({ commentId: comment._id, userId })
        .exec();
      await this.commentModel
        .findByIdAndUpdate(comment._id, { $inc: { likes: -1 } })
        .exec();
    } else {
      const newLike = new this.commentLikeModel({
        commentId: comment._id,
        userId,
      });
      await newLike.save();
      await this.commentModel
        .findByIdAndUpdate(comment._id, { $inc: { likes: 1 } })
        .exec();
    }

    return this.commentModel.findById(commentId).exec() as Promise<Comment>;
  }

  async checkIfLiked(commentId: string, userId: string): Promise<boolean> {
    const like = await this.commentLikeModel
      .findOne({ commentId, userId })
      .exec();
    return !!like;
  }
}
