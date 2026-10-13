import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Comment } from './comment.entity';

@Entity('comment_likes')
@Index(['commentId', 'ipAddress'], { unique: true })
export class CommentLike extends BaseEntity {
  @Column({ type: 'uuid' })
  commentId: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  likesAt: Date;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'commentId' })
  comment?: Comment;
}
