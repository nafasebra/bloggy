import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { PostView } from './schemas/post-view.schema';
import { PostLike } from './schemas/post-like.schema';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostView.name) private readonly postViewModel: Model<PostView>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLike>
  ) {}

  async create(post: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(post);
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findBySearch(query: string): Promise<Post[]> {
    if (!query || query.trim() === '') {
      return this.postModel.find().sort({ createdAt: -1 }).exec();
    }

    const searchQuery = query.trim();
    return this.postModel
      .find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // find by category
  async findByCategory(category: string): Promise<Post[]> {
    if (!category || category.trim() === '') {
      return this.postModel.find().sort({ createdAt: -1 }).exec();
    }

    const categoryQuery = category.trim();
    return this.postModel
      .find({
        category: { $regex: categoryQuery, $options: 'i' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: string, post: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, post, {
        new: true,
      })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  async findAllByUserId(userId: string): Promise<Post[]> {
    const posts = await this.postModel.find({ authorId: userId }).exec();
    if (!posts || posts.length === 0) {
      throw new NotFoundException('No posts found for this user');
    }
    return posts;
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
  }

  async viewPost(
    postId: string,
    ipAddress: string
  ): Promise<{ post: Post; isNewView: boolean }> {
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let isNewView = false;
    try {
      const newView = new this.postViewModel({ postId, ipAddress });
      await newView.save();
      isNewView = true;

      await this.postModel
        .findByIdAndUpdate(postId, { $inc: { views: 1 } })
        .exec();

      // Get updated post with new view count
      const updatedPost = await this.findById(postId);
      return { post: updatedPost, isNewView };
    } catch (error) {
      // If error is due to duplicate key (same IP already viewed), just return the post
      if (error.code === 11000) {
        return { post, isNewView };
      }
      throw error;
    }
  }

  async toggleLikePost(
    postId: string,
    ipAddress: string
  ): Promise<{ post: Post; isLiked: boolean }> {
    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if the IP has already liked the post
    const existingLike = await this.postLikeModel
      .findOne({ postId, ipAddress })
      .exec();

    if (existingLike) {
      // Unlike: Remove the like record and decrement the count
      await this.postLikeModel.deleteOne({ postId, ipAddress }).exec();

      await this.postModel
        .findByIdAndUpdate(postId, { $inc: { likes: -1 } })
        .exec();

      const updatedPost = await this.findById(postId);
      return { post: updatedPost, isLiked: false };
    } else {
      // Like: Create a new like record and increment the count
      const newLike = new this.postLikeModel({ postId, ipAddress });
      await newLike.save();

      await this.postModel
        .findByIdAndUpdate(postId, { $inc: { likes: 1 } })
        .exec();

      const updatedPost = await this.findById(postId);
      return { post: updatedPost, isLiked: true };
    }
  }

  async checkIfLiked(postId: string, ipAddress: string): Promise<boolean> {
    const existingLike = await this.postLikeModel
      .findOne({ postId, ipAddress })
      .exec();
    return !!existingLike;
  }
}
