import { serializeRelations } from '../common/serialize-relations';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto, ReplyCommentDto } from './dto';
import { CommentLike } from './entities/comment-like.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService
  ) {}

  async findByPostId(id: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { postId: id },
      relations: { author: true },
    });

    if (!comments || comments.length === 0) {
      return [];
    }
    return comments.map(item =>
      serializeRelations(item, { author: 'authorId' })
    );
  }

  async create(postId: string, comment: CreateCommentDto): Promise<Comment> {
    const newComment = this.commentRepository.create({ ...comment, postId });

    // Get post to find the post author
    const post = await this.postRepository.findOneBy({ _id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const savedComment = await this.commentRepository.save(newComment);

    const commentAuthorIdString = comment.authorId;

    const postAuthorIdString = post.authorId;

    // Notify post author when someone comments on their post (don't notify if commenting on own post)
    if (commentAuthorIdString !== postAuthorIdString) {
      try {
        const commentAuthor = await this.userRepository.findOneBy({
          _id: commentAuthorIdString,
        });
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
    const newComment = this.commentRepository.create({ ...comment, postId });

    // Get parent comment to find the parent comment author
    const parentComment = await this.commentRepository.findOneBy({
      _id: comment.parentId,
    });
    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    // Get post to find the post author
    const post = await this.postRepository.findOneBy({ _id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (parentComment.postId !== postId)
      throw new BadRequestException('Parent comment belongs to another post');
    const savedReply = await this.commentRepository.save(newComment);

    const replyAuthorIdString = comment.authorId;

    const parentAuthorIdString = parentComment.authorId;

    const postAuthorIdString = post.authorId;

    try {
      const replyAuthor = await this.userRepository.findOneBy({
        _id: replyAuthorIdString,
      });
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
    const result = await this.commentRepository.manager.transaction(
      async manager => {
        const comments = manager.getRepository(Comment);
        const likes = manager.getRepository(CommentLike);
        const comment = await comments.findOne({
          where: { _id: commentId },
          lock:
            manager.connection?.options.type === 'sqljs'
              ? undefined
              : { mode: 'pessimistic_write' },
        });
        if (!comment) throw new NotFoundException('Comment not found');
        const existingLike = await likes.findOneBy({ commentId, ipAddress });
        if (existingLike) {
          await likes.delete({ _id: existingLike._id });
          comment.likes = Math.max(0, (comment.likes ?? 0) - 1);
        } else {
          await likes.save(likes.create({ commentId, ipAddress }));
          comment.likes = (comment.likes ?? 0) + 1;
        }
        await comments.save(comment);
        return { comment, isLiked: !existingLike };
      }
    );
    const comment = result.comment;
    if (result.isLiked) {
      // Notify comment author when someone likes their comment (IP-based like)
      try {
        const commentAuthorIdString = comment.authorId;

        const postIdString = comment.postId;

        // Get post for context
        const post = await this.postRepository.findOneBy({ _id: postIdString });

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

    return comment;
  }

  async checkIfLiked(commentId: string, ipAddress: string): Promise<boolean> {
    const like = await this.commentLikeRepository.findOneBy({
      commentId,
      ipAddress,
    });
    return !!like;
  }

  async findById(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ _id: commentId });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async delete(commentId: string): Promise<void> {
    const existing = await this.commentRepository.findOneBy({ _id: commentId });
    if (!existing) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.delete({ _id: commentId });
  }
}
