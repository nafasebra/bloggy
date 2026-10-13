import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
@Index(['postId'])
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'text' })
  authorName: string;

  @Column({ type: 'integer', default: 0, nullable: true })
  likes?: number;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'postId' })
  post?: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'authorId' })
  author?: User;

  @ManyToOne(() => Comment, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Comment;
}
