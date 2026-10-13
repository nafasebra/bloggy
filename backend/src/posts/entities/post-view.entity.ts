import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Post } from './post.entity';

@Entity('post_views')
@Index(['postId', 'ipAddress'], { unique: true })
export class PostView extends BaseEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'text' })
  ipAddress: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  viewedAt: Date;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'postId' })
  post?: Post;
}
