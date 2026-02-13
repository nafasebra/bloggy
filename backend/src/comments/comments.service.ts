import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto, ReplyCommentDto } from './dto';
import { CommentLike } from './schemas/comment-like.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/schemas/notification.schema';
import { Post } from '../posts/schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: Model<CommentLike>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService
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
    const savedComment = await newComment.save();

    // Get post to find the post author
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const commentAuthorIdString =
      typeof comment.authorId === 'string'
        ? comment.authorId
        : (comment.authorId as { toString: () => string }).toString();

    const postAuthorIdString =
      typeof post.authorId === 'string'
        ? post.authorId
        : (post.authorId as { toString: () => string }).toString();

    // Notify post author when someone comments on their post (don't notify if commenting on own post)
    if (commentAuthorIdString !== postAuthorIdString) {
      try {
        const commentAuthor = await this.userModel
          .findById(commentAuthorIdString)
          .exec();

        if (commentAuthor) {
          await this.notificationsService.create(
            postAuthorIdString,
            NotificationType.COMMENT,
            commentAuthorIdString,
            `${commentAuthor.name || commentAuthor.username} commented on your post "${post.title}"`,
            `/post/${postId}`,
            postId,
            savedComment._id.toString()
          );
        }
      } catch (error) {
        // Don't fail comment creation if notification fails
        console.error('Failed to create notification:', error);
      }
    }

    return savedComment;
  }

  async reply(postId: string, comment: ReplyCommentDto): Promise<Comment> {
    const newComment = new this.commentModel({ ...comment, postId });
    const savedReply = await newComment.save();

    // Get parent comment to find the parent comment author
    const parentComment = await this.commentModel
      .findById(comment.parentId)
      .exec();
    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    // Get post to find the post author
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const replyAuthorIdString =
      typeof comment.authorId === 'string'
        ? comment.authorId
        : (comment.authorId as { toString: () => string }).toString();

    const parentAuthorIdString =
      typeof parentComment.authorId === 'string'
        ? parentComment.authorId
        : (parentComment.authorId as { toString: () => string }).toString();

    const postAuthorIdString =
      typeof post.authorId === 'string'
        ? post.authorId
        : (post.authorId as { toString: () => string }).toString();

    try {
      const replyAuthor = await this.userModel
        .findById(replyAuthorIdString)
        .exec();

      if (replyAuthor) {
        // Notify parent comment author when someone replies to their comment
        if (replyAuthorIdString !== parentAuthorIdString) {
          await this.notificationsService.create(
            parentAuthorIdString,
            NotificationType.COMMENT,
            replyAuthorIdString,
            `${replyAuthor.name || replyAuthor.username} replied to your comment`,
            `/post/${postId}`,
            postId,
            savedReply._id.toString()
          );
        }

        // Also notify post author if they're different from parent comment author and reply author
        if (
          postAuthorIdString !== parentAuthorIdString &&
          postAuthorIdString !== replyAuthorIdString
        ) {
          await this.notificationsService.create(
            postAuthorIdString,
            NotificationType.COMMENT,
            replyAuthorIdString,
            `${replyAuthor.name || replyAuthor.username} commented on your post "${post.title}"`,
            `/post/${postId}`,
            postId,
            savedReply._id.toString()
          );
        }
      }
    } catch (error) {
      // Don't fail reply creation if notification fails
      console.error('Failed to create notification:', error);
    }

    return savedReply;
  }

  async like(commentId: string, ipAddress: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.commentLikeModel
      .findOne({ commentId: comment._id, ipAddress })
      .exec();

    if (existingLike) {
      await this.commentLikeModel
        .deleteOne({ commentId: comment._id, ipAddress })
        .exec();
      await this.commentModel
        .findByIdAndUpdate(comment._id, { $inc: { likes: -1 } })
        .exec();
    } else {
      const newLike = new this.commentLikeModel({
        commentId: comment._id,
        ipAddress,
      });
      await newLike.save();
      await this.commentModel
        .findByIdAndUpdate(comment._id, { $inc: { likes: 1 } })
        .exec();

      // Notify comment author when someone likes their comment (IP-based like)
      try {
        const commentAuthorIdString =
          typeof comment.authorId === 'string'
            ? comment.authorId
            : (comment.authorId as { toString: () => string }).toString();

        const postIdString =
          typeof comment.postId === 'string'
            ? comment.postId
            : (comment.postId as { toString: () => string }).toString();

        // Get post for context
        const post = await this.postModel.findById(postIdString).exec();

        // Truncate comment content for notification message
        const commentPreview =
          comment.content.length > 50
            ? `${comment.content.substring(0, 50)}...`
            : comment.content;

        // Create notification for comment author
        // Since it's IP-based, we use a generic message (relatedUserId is required by schema,
        // so we use comment author ID as placeholder, but message indicates it's anonymous)
        await this.notificationsService.create(
          commentAuthorIdString,
          NotificationType.LIKE,
          commentAuthorIdString, // Required by schema, but message indicates anonymous like
          `Someone liked your comment "${commentPreview}"${post ? ` on "${post.title}"` : ''}`,
          `/post/${postIdString}`,
          postIdString,
          comment._id.toString()
        );
      } catch (error) {
        // Don't fail like operation if notification fails
        console.error('Failed to create notification:', error);
      }
    }

    return this.commentModel.findById(commentId).exec() as Promise<Comment>;
  }

  async checkIfLiked(commentId: string, ipAddress: string): Promise<boolean> {
    const like = await this.commentLikeModel
      .findOne({ commentId, ipAddress })
      .exec();
    return !!like;
  }
}
