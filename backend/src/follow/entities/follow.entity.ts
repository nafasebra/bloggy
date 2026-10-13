import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('follows')
@Index(['followerId', 'followingId'], { unique: true })
export class Follow extends BaseEntity {
  @Column({ type: 'uuid' })
  followerId: string;

  @Column({ type: 'uuid' })
  followingId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'followerId' })
  follower?: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'followingId' })
  following?: User;
}
