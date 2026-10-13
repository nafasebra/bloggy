import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
@Index(['authorId'])
export class Post extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'text' })
  category: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'text' })
  authorName: string;

  @Column({ type: 'integer', default: 0, nullable: true })
  views?: number;

  @Column({ type: 'integer', default: 0, nullable: true })
  likes?: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'authorId' })
  author?: User;
}
