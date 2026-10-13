import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
}

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['userId', 'createdAt'])
export class Notification extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'uuid' })
  relatedUserId: string;

  @Column({ type: 'uuid', nullable: true })
  relatedPostId?: string;

  @Column({ type: 'uuid', nullable: true })
  relatedCommentId?: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  link?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'relatedUserId' })
  relatedUser?: User;

  @ManyToOne(() => Post, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'relatedPostId' })
  relatedPost?: Post;

  @ManyToOne(() => Comment, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'relatedCommentId' })
  relatedComment?: Comment;
}
