import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Post } from './post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('post_likes')
@Index(['postId', 'ipAddress'], { unique: true })
@Index(['postId', 'userId'], { unique: true, where: '"userId" IS NOT NULL' })
export class PostLike extends BaseEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  likesAt: Date;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
