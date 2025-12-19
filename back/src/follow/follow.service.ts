import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService
  ) {}

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
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

    const existingFollow = await this.followModel.findOne({
      followerId,
      followingId,
    });

    if (existingFollow) {
      // Unfollow
      await this.followModel.deleteOne({
        followerId,
        followingId,
      });
      return { isFollowing: false };
    } else {
      // Follow
      const newFollow = new this.followModel({
        followerId,
        followingId,
      });
      await newFollow.save();

      // Create notification for the followed user
      try {
        const follower = await this.userModel.findById(followerId).exec();
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
    return this.followModel
      .find({ followerId: userId })
      .populate('followingId', 'name username avatar bio')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Get all followers of a specific user
   * @param userId - ID of the user
   * @returns Array of Follow documents with populated followerId
   */
  async getFollowers(userId: string): Promise<Follow[]> {
    return this.followModel
      .find({ followingId: userId })
      .populate('followerId', 'name username avatar bio')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Get follower count for a user
   * @param userId - ID of the user
   * @returns Number of followers
   */
  async getFollowerCount(userId: string): Promise<number> {
    return this.followModel.countDocuments({ followingId: userId });
  }

  /**
   * Get following count for a user
   * @param userId - ID of the user
   * @returns Number of users they follow
   */
  async getFollowingCount(userId: string): Promise<number> {
    return this.followModel.countDocuments({ followerId: userId });
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
    const follow = await this.followModel.findOne({
      followerId,
      followingId,
    });

    return { isFollowing: !!follow };
  }
}
