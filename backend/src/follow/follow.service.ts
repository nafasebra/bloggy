import { serializeRelations } from '../common/serialize-relations';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService
  ) {}

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ _id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  /**
   * Toggle follow/unfollow a user
   * @param followerId - ID of the user
   * @param followingId - ID of the user to toggle follow
   * @returns { isFollowing: boolean }
   */
  async toggleFollow(
    followerId: string,
    followingId: string
  ): Promise<{ isFollowing: boolean }> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    await this.validateUser(followerId);
    await this.validateUser(followingId);

    const existingFollow = await this.followRepository.findOneBy({
      followerId,
      followingId,
    });

    if (existingFollow) {
      // Unfollow
      await this.followRepository.delete({
        followerId,
        followingId,
      });
      return { isFollowing: false };
    } else {
      // Follow
      const newFollow = this.followRepository.create({
        followerId,
        followingId,
      });
      await this.followRepository.save(newFollow);

      // Create notification for the followed user
      try {
        const follower = await this.userRepository.findOneBy({
          _id: followerId,
        });
        if (follower) {
          await this.notificationsService.create(
            followingId,
            NotificationType.FOLLOW,
            followerId,
            `${follower.name || follower.username} started following you`,
            `/user/${followerId}`
          );
        }
      } catch (error) {
        // Don't fail the follow operation if notification creation fails
        console.error('Failed to create notification:', error);
      }

      return { isFollowing: true };
    }
  }

  /**
   * Get all users that a specific user follows
   * @param userId - ID of the user
   * @returns Array of Follow documents with populated followingId
   */
  async getFollowing(userId: string): Promise<Follow[]> {
    return this.followRepository
      .find({
        where: { followerId: userId },
        relations: { following: true },
        order: { createdAt: 'DESC' },
      })
      .then(items =>
        items.map(item =>
          serializeRelations(item, { following: 'followingId' })
        )
      );
  }

  /**
   * Get all followers of a specific user
   * @param userId - ID of the user
   * @returns Array of Follow documents with populated followerId
   */
  async getFollowers(userId: string): Promise<Follow[]> {
    return this.followRepository
      .find({
        where: { followingId: userId },
        relations: { follower: true },
        order: { createdAt: 'DESC' },
      })
      .then(items =>
        items.map(item => serializeRelations(item, { follower: 'followerId' }))
      );
  }

  /**
   * Get follower count for a user
   * @param userId - ID of the user
   * @returns Number of followers
   */
  async getFollowerCount(userId: string): Promise<number> {
    return this.followRepository.countBy({ followingId: userId });
  }

  /**
   * Get following count for a user
   * @param userId - ID of the user
   * @returns Number of users they follow
   */
  async getFollowingCount(userId: string): Promise<number> {
    return this.followRepository.countBy({ followerId: userId });
  }

  /**
   * Check if a user is following another user
   * @param followerId - ID of the follower
   * @param followingId - ID of the user being followed
   * @returns { isFollowing: boolean }
   */
  async isFollowing(
    followerId: string,
    followingId: string
  ): Promise<{ isFollowing: boolean }> {
    const follow = await this.followRepository.findOneBy({
      followerId,
      followingId,
    });

    return { isFollowing: !!follow };
  }
}
