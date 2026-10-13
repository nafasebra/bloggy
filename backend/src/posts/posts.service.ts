import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostView } from './entities/post-view.entity';
import { PostLike } from './entities/post-like.entity';
import { CreatePostDto, UpdatePostDto } from './dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostView)
    private readonly postViewRepository: Repository<PostView>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(post: CreatePostDto): Promise<Post> {
    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findBySearch(query: string): Promise<Post[]> {
    const value = query?.trim();
    return this.postRepository.find({
      where: value
        ? [
            { title: ILike('%' + value + '%') },
            { category: ILike('%' + value + '%') },
          ]
        : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Post[]> {
    const value = category?.trim();
    return this.postRepository.find({
      where: value ? { category: ILike('%' + value + '%') } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findOneBy({ _id: id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, post: UpdatePostDto): Promise<Post> {
    const existing = await this.findById(id);
    const updatedPost = await this.postRepository.save(
      this.postRepository.merge(existing, post)
    );
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { authorId: userId },
    });
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user');
    }
    return posts;
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete({ _id: id });
  }

  async viewPost(
    postId: string,
    ipAddress: string
  ): Promise<{ post: Post; isNewView: boolean }> {
    return this.postRepository.manager.transaction(async manager => {
      const posts = manager.getRepository(Post);
      const post = await posts.findOne({
        where: { _id: postId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!post) throw new NotFoundException('Post not found');
      const result = await manager
        .getRepository(PostView)
        .createQueryBuilder()
        .insert()
        .values({ postId, ipAddress })
        .orIgnore()
        .returning('_id')
        .execute();
      const isNewView = result.raw.length > 0;
      if (isNewView) {
        post.views = (post.views ?? 0) + 1;
        await posts.save(post);
      }
      return { post, isNewView };
    });
  }

  async toggleLikePost(
    postId: string,
    ipAddress: string,
    userId?: string
  ): Promise<{ post: Post; isLiked: boolean }> {
    const result = await this.postRepository.manager.transaction(
      async manager => {
        const posts = manager.getRepository(Post);
        const likes = manager.getRepository(PostLike);
        const post = await posts.findOne({
          where: { _id: postId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!post) throw new NotFoundException('Post not found');
        const where = userId
          ? [
              { postId, ipAddress },
              { postId, userId },
            ]
          : { postId, ipAddress };
        const existingLike = await likes.findOneBy(where);
        if (existingLike) {
          await likes.delete({ _id: existingLike._id });
          post.likes = Math.max(0, (post.likes ?? 0) - 1);
        } else {
          await likes.save(likes.create({ postId, ipAddress, userId }));
          post.likes = (post.likes ?? 0) + 1;
        }
        await posts.save(post);
        return { post, isLiked: !existingLike };
      }
    );
    const post = result.post;
    if (result.isLiked) {
      // Create notification if user is authenticated and not liking their own post
      const authorIdString = post.authorId;

      if (userId && userId !== authorIdString) {
        try {
          const liker = await this.userRepository.findOneBy({ _id: userId });

          if (liker) {
            await this.notificationsService.create(
              authorIdString,
              NotificationType.LIKE,
              userId,
              `${liker.name || liker.username} liked your post "${post.title}"`,
              `/post/${postId}`,
              postId
            );
          }
        } catch (error) {
          // Don't fail the like operation if notification creation fails
          console.error('Failed to create notification:', error);
        }
      }
    }
    return result;
  }

  async checkIfLiked(
    postId: string,
    ipAddress: string,
    userId?: string
  ): Promise<boolean> {
    const query = userId
      ? [
          { postId, ipAddress },
          { postId, userId },
        ]
      : { postId, ipAddress };

    const existingLike = await this.postLikeRepository.findOneBy(query);
    return !!existingLike;
  }
}
