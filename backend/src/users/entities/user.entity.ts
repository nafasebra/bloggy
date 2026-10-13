import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  twitter?: string;

  @Column({ type: 'integer', default: 0, nullable: true })
  followers?: number;

  @Column({ type: 'integer', default: 0, nullable: true })
  following?: number;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'boolean', default: true })
  isNew: boolean;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';
}
